import { Plugin } from "rollup";
import { FilterPattern } from '@rollup/pluginutils'

interface RollupRequireContextOptions {
    /**
     * you can specifically include/exclude files
     * @default undefined
     */
    include?: FilterPattern;
    /**
     * you can specifically include/exclude files
     * @default undefined
     */
    exclude?: FilterPattern;
}

/**
 * rollup-plugin for webpack require-context
 */
export default function requireContext(options?: RollupRequireContextOptions): Plugin;
