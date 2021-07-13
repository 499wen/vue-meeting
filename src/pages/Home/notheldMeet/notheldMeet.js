import { mapState } from 'vuex'

export default {
  data() {
    return {
      filterData: []
    }
  },
  methods: {
    // 查看更多
    more(){
      
    },
  },
  computed: {
    ...mapState([
      'notheldMeet'
    ])
  },
  mounted() {
    let curTime = new Date().getTime()
    this.filterData = this.notheldMeet.filter(its => curTime < its.beginDate && its)
  },
  watch: {
    'notheldMeet': function(val) {

    }
  }
}