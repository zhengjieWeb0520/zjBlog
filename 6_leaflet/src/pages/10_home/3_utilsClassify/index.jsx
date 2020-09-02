import React, { useEffect } from 'react'
import utils from '../../../utils/utils'
/* utils整合学习 */
export default function App () {
  useEffect(() => {
    /* mount */
    const array1 = [2, 3, 4, [2, 4], [3, 6]]
    const array2 = [1, 2, 4, [1, 5], [3, 6]]
    console.warn('判断数组是否相等：', utils.uArray.arrEquals(array1, array2))

    console.warn('求数组并集：', utils.uArray.arrUnion(array1, array2))

    console.warn('求数组交集：', utils.uArray.arrIntersection(array1, array2))

    console.warn('多维数组降维：', utils.uArray.arrSteamroller(array1))

    const array3 = [
      {
        a: 1,
        b: 2,
        c: {
          d: 3
        }
      },
      {
        a: 2,
        b: 3,
        c: {
          d: 6
        }
      }
    ]
    console.warn('多维数组对象提取某个键值的值至新数组：', utils.uArray.arrObjSteamroller(array3, 'a'))
    console.warn('多维数组对象提取某个键值的值至新数组2：', utils.uArray.extractArrayKeys(array3, 'a'))

    const array4 = [1, 2, 3, 2, 1, 4, 2, 1]
    console.warn('统计数组各要素的个数：', utils.uArray.arrItemCount(array4))

    console.warn('数组移除某一元素', utils.uArray.arrRemoveElement(array4, 1))

    const array5 = [
      {
        a: 5,
        b: 6
      },
      {
        a: 7,
        b: 8
      },
      {
        a: 4,
        b: 5
      }
    ]

    // console.warn('数组对象移除某一元素', utils.uArray.arrObjRemoveElement(array5, 'a', 5))

    utils.uArray.arrObjItemSort(array5, 'a', 'ascending')
    console.warn('数组对象根据某一键值升序', array5)

    const array6 = [
      {
        a: 5,
        b: 6
      },
      {
        a: 7,
        b: 8
      },
      {
        a: 4,
        b: 5
      },
      {
        a: 4,
        b: 5
      }
    ]
    utils.uArray.arrObjItemSort(array6, 'a', 'descending')
    console.warn('数组对象根据某一键值降序:', array6)


    console.warn('组对象根据某一键值去重:', utils.uArray.arrObjKeyUnique(array6, 'a'))

    console.warn('数组对象判断是否某个键包含某个值:', utils.uArray.arrObjHasValue(array6, 'a', 7))

    console.warn('数组对象根据某一键值的值求和：', utils.uArray.arrObjSumByKey(array6, 'a'))
    return () => {
      /* unmount */
    }
  }, [])
  return (
    <div>
      <h1>utils 整合</h1>
    </div>
  )
}



