/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 13:45:03
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:30:48
 * @Description:
 */
import * as types from './mutation-types'

/**
 * 存入源代码
 */
export const saveOriginalCodes = ({ commit }, params) => {
  commit(types.SAVE_ORIGINAL_CODES, params)
}

/**
 * 存入验证代码
 */
export const saveValidationCodes = ({ commit }, params) => {
  commit(types.SAVR_VALIDATION_CODES, params)
}

/**
 * 存入转化代码
 */
export const saveTransformCodes = ({ commit }, params) => {
  commit(types.SAVE_TRANSFORM_CODES, params)
}

/**
 * 存入需转换的坐标系
 */
export const saveOriginCoor = ({ commit }, params) => {
  commit(types.SAVE_SELECTED_ORIGIN, params)
}

/**
 * 存入转换的坐标系
 */
export const saveTransformCoor = ({ commit }, params) => {
  commit(types.SAVE_SELECTED_TRANSFORM, params)
}