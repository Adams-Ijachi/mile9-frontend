import { isUndefined } from "lodash";

const assignCustomizer = (objValue, srcValue) => isUndefined(objValue) ? srcValue : objValue;

export default assignCustomizer;