import axiosClient from "./axiosClient";
import transformToFormData from './transformToFormData';
import getToken from './getToken';
import catchAxiosErrors from './catchAxiosErrors';
import slugify from "./slugify";
import assignCustomizer from "./assignCustomizer";
import moneyFormat from "./moneyFormat";

export { transformToFormData, getToken, catchAxiosErrors, slugify, moneyFormat, assignCustomizer };
export default axiosClient;