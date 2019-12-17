import 'absol/src/polyfill';

import Assembler from './js/core/Assembler'
import BaseComponent from './js/core/BaseComponent'
import Fcore from './js/core/FCore'
import FModel from './js/core/FModel';
import FNode from './js/core/FNode';
import FViewable from './js/core/FViewable';
import PluginManager from './js/core/PluginManager';
import UploadEditor from './js/editor/UploadEditor';
import sortTable from './js/lib/sorttable';
import R from './js/R';
import * as framePlugins from './js/frame/plugins';
export default {
    BaseComponent: BaseComponent,
    Assembler: Assembler,
    core: Fcore,
    FNode: FNode,
    FModel: FModel,
    FViewable: FViewable,
    PluginManager: PluginManager,
    framePlugin:framePlugins,
    UploadEditor:UploadEditor,
    R: R,
    sortTable:sortTable
};