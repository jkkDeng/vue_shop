export default {
    data() {
        return {
            rightsList: []
        }
    },
    created() {
        this.getRightsList()
    },
    methods: {
        async getRightsList() {
            // const { data: res } = await this.$http.get('rights/list')
            const { data: res } = await this.$api.GetRightsList()
            
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限列表失败')
            }
            this.rightsList = res.data
        }
    },
}