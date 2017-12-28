import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: null,
    searchQ: '',
    searching: false,
    count: 0,
    result: null,
    autoselectResult: false
  },
  mutations: {
    setAutoselectResult: (state, value) => {
      state.autoselectResult = value
    },
    setMap: (state, map) => {
      state.map = map
      console.log('MAP now set', state)
    },
    selectResult: (state, result) => {
      state.result = result
      console.log('RESULT now set', result)
    },
    search: (state) => (q) => {
      state.searchQ = q
      state.searching = true
    },
    showResults: state => state.count--
  },
  strict: false
})
