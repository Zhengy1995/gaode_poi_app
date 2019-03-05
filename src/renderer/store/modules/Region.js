const state = {
  region: [],
  pois: [],
  cities: [{
    value: 510100,
    label: '成都市'
  }, {
    value: 510400,
    label: '攀枝花市'
  }, {
    value: 511800,
    label: '雅安市'
  }, {
    value: 513200,
    label: '阿坝藏族羌族自治州'
  }, {
    value: 511900,
    label: '巴中市'
  }, {
    value: 511700,
    label: '达州市'
  }, {
    value: 510600,
    label: '德阳市'
  }, {
    value: 513300,
    label: '甘孜藏族自治州'
  }, {
    value: 511600,
    label: '广安市'
  }, {
    value: 510800,
    label: '广元市'
  }, {
    value: 511100,
    label: '乐山市'
  }, {
    value: 513400,
    label: '凉山彝族自治州'
  }, {
    value: 511400,
    label: '眉山市'
  }, {
    value: 510700,
    label: '绵阳市'
  }, {
    value: 511300,
    label: '南充市'
  }, {
    value: 511000,
    label: '内江市'
  }, {
    value: 510900,
    label: '遂宁市'
  }, {
    value: 511500,
    label: '宜宾市'
  }, {
    value: 512000,
    label: '资阳市'
  }, {
    value: 510300,
    label: '自贡市'
  }, {
    value: 510500,
    label: '泸州市'
  }],
  types: ['小区', '学校', '健身', '景点', '美食', '商场', '医疗', '金融', '酒店', '生活服务', '公司企业', '文化场馆', '休闲娱乐', '自然地物', '政府机构'],
  province: [{
    value: '四川省',
    label: '四川省'
  }]
}

const mutations = {
  ADD_REGION (state, region) {
    state.region = region
  },
  ADD_POIS (state, pois) {
    state.pois = pois
  }
}

const actions = {
  someAsyncTask ({ commit }, region) {
    // do something async
    commit('ADD_REGION', region)
  },
  saveStatus ({commit}, data) {
    commit('ADD_POIS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
