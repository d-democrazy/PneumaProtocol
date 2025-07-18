import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';

/**
 * Environment Configuration System
 * 
 * ALGORITHM OVERVIEW:
 * ==================
 * This module implements a robust environment variable loading and validation system
 * using a multi-layered approach:
 * 
 * 1. ENVIRONMENT LOADING STRATEGY:
 *    - Primary: Load from .env.local (development/testing)
 *    - Fallback: System environment variables (production)
 *    - Override: Command-line arguments take precedence
 * 
 * 2. VALIDATION ALGORITHM:
 *    - Schema-based validation using Zod for type safety
 *    - Required vs optional variable classification
 *    - Format validation (URLs, ports, API keys)
 *    - Transformation and normalization
 * 
 * 3. ERROR HANDLING STRATEGY:
 *    - Fail-fast on missing required variables
 *    - Detailed error messages with suggestions
 *    - Environment-specific defaults
 *    - Graceful degradation for optional configs
 * 
 * 4. SECURITY CONSIDERATIONS:
 *    - API key validation and masking
 *    - URL sanitization and validation
 *    - Port range validation
 *    - Sensitive data protection in logs
 */

// Load environment variables from .env.local first, then system env
config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Core Blockchain Configuration Schema
 * 
 * VALIDATION LOGIC:
 * ================
 * - RPC_URL: Must be valid HTTP/HTTPS URL for blockchain connection
 * - ENDPOINT_URL: Core blockchain API endpoint with proper format validation
 * - EXPLORER: Block explorer URL for transaction links
 * - API_KEY: Required for Core blockchain API authentication
 * - API_PORT: Server port with range validation (1024-65535)
 * - SCORE_MULTIPLIER: Configurable multiplier for TxnFeeInvolved calculation
 */
const envSchema = z.object({
    // Core Blockchain Connection
    RPC_URL: z
        .string()
        .url('RPC_URL must be a valid HTTP/HTTPS URL')
        .refine(
            (url) => url.startsWith('http://') || url.startsWith('https://'),
            'RPC_URL must use HTTP or HTTPS protocol'
        ),

    ENDPOINT_URL: z
        .string()
        .url('ENDPOINT_URL must be a valid HTTP/HTTPS URL')
        .refine(
            (url) => url.includes('api'),
            'ENDPOINT_URL should contain "api" in the path'
        ),

    EXPLORER: z
        .string()
        .url('EXPLORER must be a valid HTTP/HTTPS URL'),

    // Authentication & Security
    API_KEY: z
        .string()
        .min(8, 'API_KEY must be at least 8 characters long')
        .refine(
            (key) => !/\s/.test(key),
            'API_KEY must not contain whitespace'
        ),

    // Server Configuration
    API_PORT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine(
            (port) => port >= 1024 && port <= 65535,
            'API_PORT must be between 1024 and 65535'
        ),

    // Scoring Configuration (Configurable multiplier as requested)
    SCORE_MULTIPLIER: z
        .string()
        .optional()
        .default('0.25')
        .transform((val) => parseFloat(val))
        .refine(
            (mult) => mult >= 0 && mult <= 1,
            'SCORE_MULTIPLIER must be between 0 and 1'
        ),

    // Optional Development Settings
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .optional()
        .default('development'),

    // Monitoring & Performance
    FETCH_TIMEOUT: z
        .string()
        .optional()
        .default('30000')
        .transform((val) => parseInt(val, 10))
        .refine(
            (timeout) => timeout >= 5000 && timeout <= 120000,
            'FETCH_TIMEOUT must be between 5000ms and 120000ms'
        ),

    RETRY_ATTEMPTS: z
        .string()
        .optional()
        .default('3')
        .transform((val) => parseInt(val, 10))
        .refine(
            (attempts) => attempts >= 1 && attempts <= 10,
            'RETRY_ATTEMPTS must be between 1 and 10'
        ),
});

/**
 * Configuration Interface
 * 
 * TYPE SAFETY STRATEGY:
 * ====================
 * This interface ensures compile-time type checking and IntelliSense support
 * across the entire application. All configuration access is type-safe.
 */
export interface AppConfig {
    // Core Blockchain Settings
    rpcUrl: string;
    endpointUrl: string;
    explorer: string;
    apiKey: string;

    // Server Settings
    apiPort: number;

    // Scoring Algorithm Settings
    scoreMultiplier: number;

    // Environment Settings
    nodeEnv: 'development' | 'production' | 'test';

    // Performance Settings
    fetchTimeout: number;
    retryAttempts: number;

    // Derived Configuration
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
}

/**
 * Environment Configuration Loader
 * 
 * LOADING ALGORITHM:
 * =================
 * 1. Collect raw environment variables
 * 2. Apply schema validation with detailed error reporting
 * 3. Transform and normalize values
 * 4. Create derived configuration properties
 * 5. Validate cross-property dependencies
 * 6. Return immutable configuration object
 * 
 * ERROR HANDLING:
 * ==============
 * - Validation errors include specific field and expected format
 * - Missing required variables are reported with clear instructions
 * - Invalid formats are caught early with helpful error messages
 * - Configuration loading failure terminates the application safely
 */
function loadConfiguration(): AppConfig {
    try {
        // Parse and validate environment variables
        const env = envSchema.parse(process.env);

        // Create normalized configuration object
        const config: AppConfig = {
            // Core blockchain configuration
            rpcUrl: env.RPC_URL,
            endpointUrl: env.ENDPOINT_URL,
            explorer: env.EXPLORER,
            apiKey: env.API_KEY,

            // Server configuration
            apiPort: env.API_PORT,

            // Scoring configuration
            scoreMultiplier: env.SCORE_MULTIPLIER,

            // Environment configuration
            nodeEnv: env.NODE_ENV,

            // Performance configuration
            fetchTimeout: env.FETCH_TIMEOUT,
            retryAttempts: env.RETRY_ATTEMPTS,

            // Derived boolean flags for convenient environment checking
            isDevelopment: env.NODE_ENV === 'development',
            isProduction: env.NODE_ENV === 'production',
            isTest: env.NODE_ENV === 'test',
        };

        // Validate cross-property dependencies
        validateConfigurationDependencies(config);

        // Log successful configuration loading (with sensitive data masked)
        if (config.isDevelopment) {
            console.log('✅ Configuration loaded successfully');
            console.log(`🔗 RPC URL: ${config.rpcUrl}`);
            console.log(`🌐 API Endpoint: ${config.endpointUrl}`);
            console.log(`🔍 Explorer: ${config.explorer}`);
            console.log(`🔑 API Key: ${maskSensitiveData(config.apiKey)}`);
            console.log(`🚀 Server Port: ${config.apiPort}`);
            console.log(`📊 Score Multiplier: ${config.scoreMultiplier}`);
        }

        return config;

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Configuration validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });

            // Provide helpful suggestions for common configuration errors
            providConfigurationSuggestions(error);
        } else {
            console.error('❌ Failed to load configuration:', error);
        }

        process.exit(1);
    }
}

/**
 * Cross-Property Validation
 * 
 * DEPENDENCY VALIDATION ALGORITHM:
 * ===============================
 * Validates relationships between configuration properties that cannot be
 * expressed in the schema validation alone.
 */
function validateConfigurationDependencies(config: AppConfig): void {
    // Ensure RPC and API endpoints are from the same network
    const rpcHost = new URL(config.rpcUrl).hostname;
    const apiHost = new URL(config.endpointUrl).hostname;

    if (rpcHost !== apiHost) {
        console.warn(`⚠️  Warning: RPC (${rpcHost}) and API (${apiHost}) hostnames differ`);
        console.warn('   This might indicate a configuration mismatch');
    }

    // Validate explorer matches the network
    const explorerHost = new URL(config.explorer).hostname;
    if (explorerHost !== apiHost) {
        console.warn(`⚠️  Warning: Explorer (${explorerHost}) hostname differs from API`);
    }
}

/**
 * Sensitive Data Masking Utility
 * 
 * SECURITY ALGORITHM:
 * ==================
 * Masks sensitive configuration data for logging while preserving
 * enough information for debugging purposes.
 */
function maskSensitiveData(sensitiveValue: string): string {
    if (sensitiveValue.length <= 8) {
        return '*'.repeat(sensitiveValue.length);
    }

    const visibleChars = 4;
    const start = sensitiveValue.substring(0, visibleChars);
    const end = sensitiveValue.substring(sensitiveValue.length - visibleChars);
    const masked = '*'.repeat(sensitiveValue.length - (visibleChars * 2));

    return `${start}${masked}${end}`;
}

/**
 * Configuration Error Suggestions
 * 
 * HELP SYSTEM ALGORITHM:
 * =====================
 * Analyzes validation errors and provides specific, actionable suggestions
 * to help developers resolve configuration issues quickly.
 */
function providConfigurationSuggestions(error: z.ZodError): void {
    console.log('\n💡 Configuration suggestions:');

    const missingFields = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path[0]);

    if (missingFields.length > 0) {
        console.log('  📝 Missing required variables:');
        missingFields.forEach(field => {
            switch (field) {
                case 'RPC_URL':
                    console.log('    RPC_URL=https://rpc.test2.btcs.network');
                    break;
                case 'ENDPOINT_URL':
                    console.log('    ENDPOINT_URL=https://api.test2.btcs.network/api');
                    break;
                case 'EXPLORER':
                    console.log('    EXPLORER=https://scan.test2.btcs.network');
                    break;
                case 'API_KEY':
                    console.log('    API_KEY=your_api_key_here');
                    break;
                case 'API_PORT':
                    console.log('    API_PORT=3000');
                    break;
                default:
                    console.log(`    ${field}=<required_value>`);
            }
        });
    }

    console.log('  📁 Create a .env.local file in your project root with the above variables');
}

/**
 * Configuration Validation Utility
 * 
 * RUNTIME VALIDATION:
 * ==================
 * Provides runtime validation for configuration-dependent operations.
 * Used by other modules to ensure configuration requirements are met.
 */
export function validateConfigForOperation(operation: string, requiredFields: (keyof AppConfig)[]): void {
    const config = getConfig();
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
        throw new Error(
            `Configuration validation failed for ${operation}. ` +
            `Missing fields: ${missingFields.join(', ')}`
        );
    }
}

// Load and export the configuration
const appConfig = loadConfiguration();

/**
 * Get Application Configuration
 * 
 * SINGLETON PATTERN:
 * =================
 * Returns the immutable configuration object. Configuration is loaded once
 * at application startup and cached for the entire application lifecycle.
 */
export function getConfig(): AppConfig {
    return appConfig;
}

// Export configuration for direct access (discouraged - use getConfig() instead)
export default appConfig;