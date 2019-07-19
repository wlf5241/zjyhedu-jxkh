import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const clList = []

const lbList = []
const xmList = []
const jbList = []
const allList = []

let did = 1

for (let i = 0; i <= 5; i++) {
  lbList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    dj: 0,
    djtags: [],
    ty: 0,
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++
  allList.push(lbList[i])
}

for (let i = 1; i <= 10; i++) {
  xmList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    dj: 0,
    djtags: [],
    ty: 0,
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++
}

for (let i = 1; i <= 10; i++) {
  jbList.push(Mock.mock({
    classid: did,
    parentid: 0,
    mc: '@first',
    fz: '@integer(10, 50)',
    qz: '@integer(1, 50)',
    ordernum: '@integer(1, 10)',
    'dj|1': ['0', '1'],
    djtags: [{
      id: 1,
      mc: '发表',
      fz: 30,
      ordernum: 1
    }, {
      id: 2,
      mc: '一等奖',
      fz: 20,
      ordernum: 2
    }, {
      id: 3,
      mc: '二等奖',
      fz: 10,
      ordernum: 3
    }, {
      id: 4,
      mc: '三等奖',
      fz: 5,
      ordernum: 3
    }],
    'ty|1': ['0', '1'],
    addtime: '@datetime',
    updatetime: '@datetime'
  }))
  did++
}

xmList.forEach((item, index) => {
  // item.parentid = lbList[Math.floor(Math.random() * lbList.length - 1) + 1].classid
  item.parentid = lbList[index % lbList.length].classid
  allList.push(item)
})

jbList.forEach((item, index) => {
  // item.parentid = xmList[Math.floor(Math.random() * xmList.length - 1) + 1].classid
  item.parentid = xmList[index % xmList.length].classid
  if (item.dj === '0') item.djtags.length = 0
  allList.push(item)
})

for (let i = 1; i <= 10; i++) {
  clList.push(Mock.mock({
    id: i,
    'classid|16-25': 16,
    // classid: 17,
    // 学校ID
    xxid: 1,
    mc: '@first',
    hjsj: '@datetime',
    bjdw: '@first',
    zz: '@first',
    'hjdj|1-4': 4,
    'fz|1-4': 4,
    'km|1-8': 8,
    'fj|1-5': [
      {
        'id|+1': [
          1,
          2,
          3
        ],
        'name|+1': [
          '@title(1,2)',
          '@title(1,2)',
          '@title(1,2)'
        ],
        'url|+1': [
          '@url()',
          '@url()',
          '@url()'
        ]
      }
    ],
    'zt|1': [{
      type: 0,
      strtype: '未上报',
      msg: ''
    },
    {
      type: 1,
      strtype: '已上报',
      msg: ''
    },
    {
      type: 2,
      strtype: '退回',
      msg: '被退回的原因'
    },
    {
      type: 3,
      strtype: '通过',
      msg: ''
    }],
    bz: '@title(1,2)',
    sbsj: '@datetime',
    gxsj: '@datetime',
    'ordernum|1-100': 100
  }))
}
// console.log('jbList', jbList)
// console.log('clList', clList)

export default {
  getClassAndClList: config => {
    const { classid } = param2Obj(config.url)

    const newLbList = lbList.filter(item => {
      if (!item) return false
      if (classid && classid.split(',').indexOf(item.classid.toString()) < 0) return false
      return true
    })

    // console.log(newLbList)

    const mockList = []
    let tempObj = {}
    let xmtempObj = {}
    let jbtempObj = {}
    newLbList.forEach((key1, index1) => {
      tempObj = {}
      tempObj.lbid = key1.classid
      tempObj.lbmc = key1.mc
      tempObj.xmList = []
      xmList.forEach((key2, index2) => {
        xmtempObj = {}
        if (key2.parentid === key1.classid) {
          xmtempObj.xmid = key2.classid
          xmtempObj.xmmc = key2.mc
          xmtempObj.fz = key2.fz
          xmtempObj.jbList = []
          jbList.forEach((key3, index3) => {
            jbtempObj = {}
            if (key3.parentid === key2.classid) {
              jbtempObj.jbid = key3.classid
              jbtempObj.jbmc = key3.mc
              jbtempObj.fz = key3.fz

              // 查找材料
              jbtempObj.clList = clList.filter(item => {
                return key3.classid === item.classid
              })
              if (jbtempObj.clList.length > 0) xmtempObj.jbList.push(jbtempObj)
            }
          })
          if (xmtempObj.jbList.length > 0) tempObj.xmList.push(xmtempObj)
        }
      })
      if (tempObj.xmList.length > 0) mockList.push(tempObj)
    })

    return {
      total: mockList.length,
      items: mockList
    }
  },
  // 评分汇总
  getPfhzList: config => {
    const mockList = []
    for (let i = 1; i <= 10; i++) {
      mockList.push(Mock.mock({
        jsmc: '@first',
        'clsl|10-15': 10,
        fz: '@integer(10, 50)',
        qz: '@integer(1, 50)',
        addtime: '@datetime',
        updatetime: '@datetime'
      }))
    }
    return {
      total: mockList.length,
      items: mockList
    }
  },
  // 学段对应材料
  getXdAndCllist: config => {
    const { classid } = param2Obj(config.url)

    const newLbList = lbList.filter(item => {
      if (!item) return false
      if (classid && classid.split(',').indexOf(item.classid.toString()) < 0) return false
      return true
    })

    // console.log(newLbList)

    const mockList = []
    let tempObj = {}
    let xmtempObj = {}
    let jbtempObj = {}
    newLbList.forEach((key1, index1) => {
      tempObj = {}
      tempObj.lbid = key1.classid
      tempObj.lbmc = key1.mc
      tempObj.xmList = []
      xmList.forEach((key2, index2) => {
        xmtempObj = {}
        if (key2.parentid === key1.classid) {
          xmtempObj.xmid = key2.classid
          xmtempObj.xmmc = key2.mc
          xmtempObj.fz = key2.fz
          xmtempObj.jbList = []
          jbList.forEach((key3, index3) => {
            jbtempObj = {}
            if (key3.parentid === key2.classid) {
              jbtempObj.jbid = key3.classid
              jbtempObj.jbmc = key3.mc
              jbtempObj.fz = key3.fz

              // 查找材料
              jbtempObj.clList = clList.filter(item => {
                return key3.classid === item.classid
              })
              if (jbtempObj.clList.length > 0) xmtempObj.jbList.push(jbtempObj)
            }
          })
          if (xmtempObj.jbList.length > 0) tempObj.xmList.push(xmtempObj)
        }
      })
      if (tempObj.xmList.length > 0) mockList.push(tempObj)
    })

    return {
      total: mockList.length,
      items: mockList
    }
  }
}
