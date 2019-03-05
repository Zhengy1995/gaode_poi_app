export default {
    data () {
        return {
            second: 60
        }
    },
    computed: {
        i18n () {
            return this.$t('index')
        },
        //注意：在computed里定义的变量不能再在data里出现
        reSendWord () {
            return `${this.i18n.reSendWord}(${this.second}s)`
        }
    }
}