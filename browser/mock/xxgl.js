// import Mock from 'mockjs'
// import { param2Obj } from '@/utils'

const xxList = [
  {
    'xxid': 1,
    // 学校类型，幼儿园，小学，初中，高中
    'xxlx': 3,
    'xxmc': '莲都区碧湖中学',
    'njlist': [
      {
        'njid': 1,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '7',
        'njmc': '初一',
        'bjlist': [
          {
            'bjid': 1,
            'bjmc': '初中一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 2,
            'bjmc': '初中一年级(02)班',
            'bjbh': '2'
          }
        ]
      },
      {
        'njid': 2,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '8',
        'njmc': '初二',
        'bjlist': [
          {
            'bjid': 3,
            'bjmc': '初中一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 4,
            'bjmc': '初中一年级(02)班',
            'bjbh': '2'
          }
        ]
      }
    ]
  },
  {
    'xxid': 2,
    'xxlx': 3,
    'xxmc': '莲都区花园中学',
    'njlist': [
      {
        'njid': 3,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '7',
        'njmc': '初一',
        'bjlist': [
          {
            'bjid': 5,
            'bjmc': '初中一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 6,
            'bjmc': '初中一年级(02)班',
            'bjbh': '2'
          }
        ]
      },
      {
        'njid': 4,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '8',
        'njmc': '初二',
        'bjlist': [
          {
            'bjid': 7,
            'bjmc': '初中一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 8,
            'bjmc': '初中一年级(02)班',
            'bjbh': '2'
          }
        ]
      }
    ]
  },
  {
    'xxid': 3,
    'xxlx': 2,
    'xxmc': '莲都区实验小学',
    'njlist': [
      {
        'njid': 5,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '1',
        'njmc': '一年级',
        'bjlist': [
          {
            'bjid': 9,
            'bjmc': '小学一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 10,
            'bjmc': '小学一年级(02)班',
            'bjbh': '2'
          }
        ]
      },
      {
        'njid': 6,
        // 编号和名称从字典获取 小学1-6，初中7-9
        'njbh': '2',
        'njmc': '二年级',
        'bjlist': [
          {
            'bjid': 11,
            'bjmc': '小学一年级(01)班',
            'bjbh': '1'
          },
          {
            'bjid': 12,
            'bjmc': '小学一年级(02)班',
            'bjbh': '2'
          }
        ]
      }
    ]
  }
]

export default [
  {
    url: '/xxglapi/allxxnjbytree',
    type: 'get',
    response: config => {
      // const { ty } = param2Obj(config.url)

      const mockList = []
      let tempObj = {}
      let tempObj2 = {}
      let tempObj3 = {}
      xxList.forEach((key, index) => {
        tempObj = {}
        tempObj.xxid = key.xxid
        tempObj.label = key.xxmc
        tempObj.xxlx = key.xxlx
        tempObj.children = []

        key.njlist.forEach((key2, index2) => {
          tempObj2 = {}
          tempObj2.xxid = key.xxid
          tempObj2.label = key2.njmc
          tempObj2.njbh = key2.njbh
          tempObj2.children = []

          key2.bjlist.forEach((key3, index3) => {
            tempObj3 = {}
            tempObj3.xxid = key.xxid
            tempObj3.njbh = key2.njbh
            tempObj3.bjid = key3.bjid
            tempObj3.label = key3.bjmc
            tempObj3.bjbh = key3.bjbh

            tempObj2.children.push(tempObj3)
          })

          tempObj.children.push(tempObj2)
        })

        mockList.push(tempObj)
      })

      return {
        code: 20000,
        items: mockList
      }
    }
  },
  {
    url: '/xxglapi/xxnjlist',
    type: 'get',
    response: config => {
      // const { ty } = param2Obj(config.url)

      const mockList = []
      let tempObj = {}
      let tempObj2 = {}
      let tempObj3 = {}
      xxList.forEach((key, index) => {
        tempObj = {}
        tempObj.xxid = key.xxid
        tempObj.label = key.xxmc
        tempObj.xxlx = key.xxlx
        tempObj.children = []

        key.njlist.forEach((key2, index2) => {
          tempObj2 = {}
          tempObj2.njid = key2.njid
          tempObj2.label = key2.njmc
          tempObj2.njbh = key2.njbh
          tempObj2.children = []

          key2.bjlist.forEach((key3, index3) => {
            tempObj3 = {}
            tempObj3.bjid = key3.bjid
            tempObj3.label = key3.bjmc
            tempObj3.bjbh = key3.bjbh

            tempObj2.children.push(tempObj3)
          })
          tempObj.children.push(tempObj2)
        })

        mockList.push(tempObj)
      })

      return {
        code: 20000,
        items: mockList
      }
    }
  }
]
