import { mapState } from 'vuex'

export default {
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
    
  }
}