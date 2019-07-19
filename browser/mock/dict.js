import { param2Obj } from '@/utils'
/**
 * 获取一些字典数据
 */

export default {
  // 获取学校列表
  getXxList: config => {
    const xxList = [{
      id: 1,
      mc: '云和县云和中学'
    },
    {
      id: 2,
      mc: '云和县云和职技校'
    },
    {
      id: 3,
      mc: '云和县云和二中'
    }]
    return {
      total: xxList.length,
      items: xxList
    }
  },
  // 获取教师列表
  getZzList: config => {
    const { xxid } = param2Obj(config.url)
    const zzList = [{
      id: 1,
      xxid: 1,
      mc: '老师1'
    },
    {
      id: 2,
      xxid: 1,
      mc: '老师2'
    },
    {
      id: 3,
      xxid: 2,
      mc: '老师3'
    }]
    console.log(xxid)
    const newList = zzList.filter(item => {
      if (xxid && item.xxid !== Number(xxid)) return false
      return true
    })
    console.log(newList)
    return {
      total: newList.length,
      items: newList
    }
  },
  // 科目
  getKmList: config => {
    const kmList = [{
      id: 1,
      mc: '小学',
      km: [{
        id: 1, mc: '语文'
      }, {
        id: 2, mc: '数学'
      }, {
        id: 3, mc: '英语'
      }, {
        id: 4, mc: '信息技术'
      }, {
        id: 5, mc: '通用技术'
      }, {
        id: 6, mc: '历史'
      }, {
        id: 7, mc: '化学'
      }, {
        id: 8, mc: '政治'
      }]
    }, {
      id: 1,
      mc: '初中',
      km: [{
        id: 1, mc: '语文'
      }, {
        id: 2, mc: '数学'
      }, {
        id: 3, mc: '英语'
      }, {
        id: 4, mc: '信息技术'
      }, {
        id: 5, mc: '通用技术'
      }, {
        id: 6, mc: '历史'
      }, {
        id: 7, mc: '化学'
      }, {
        id: 8, mc: '政治'
      }]
    }, {
      id: 1,
      mc: '高中',
      km: [{
        id: 1, mc: '语文'
      }, {
        id: 2, mc: '数学'
      }, {
        id: 3, mc: '英语'
      }, {
        id: 4, mc: '信息技术'
      }, {
        id: 5, mc: '通用技术'
      }, {
        id: 6, mc: '历史'
      }, {
        id: 7, mc: '化学'
      }, {
        id: 8, mc: '政治'
      }]
    }]
    return {
      total: kmList.length,
      items: kmList
    }
  }
}
