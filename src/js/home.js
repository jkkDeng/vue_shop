export default {
    data() {
        return {
            menulist: [],
            iconlist: {
                '125': 'el-icon-s-custom',
                '103': 'el-icon-s-check',
                '101': 'el-icon-s-check',
                '102': 'el-icon-s-goods',
                '145': 'el-icon-data-analysis'
            },
            isCollapse: false,
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        loginOut() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            // const { data: res } = await this.$http.get('menus')
            const { data: res } = await this.$api.GetMenus()
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
        },
        // 菜单折叠
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}