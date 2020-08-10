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
    /**
     * search for files other than .js files (must already
     * be transpiled by a previous plugin!)
     * @default [ '.js' ]
     */
    extensions?: ReadonlyArray<string | RegExp>;
}

/**
 * rollup-plugin for webpack require-context
 */
export default function requireContext(options?: RollupRequireContextOptions): Plugin;
