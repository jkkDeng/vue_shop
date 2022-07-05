export default {
    data() {
        return {
            // 所有角色列表数据
            roleList: [],
            setRightDialogVisible: false,
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 即将请求的roleId
            roleId: '',
            defKeys: []
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            // const { data: res } = await this.$http.get('roles')
            const { data: res } = await this.$api.GetRoles('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.roleList = res.data
            console.log(this.roleList);
        },
        async removeRightById(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 确认 confirm
            // 取消 cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            const { data: res } = await this.$api.DeleteRight(role.id, rightId)
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败！')
            }
            this.$message.success('删除权限成功！')
            // this.getRolesList()
            // 删除刚好会返回最新的
            role.children = res.data
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
            // const { data: res } = await this.$http.get('rights/tree')
            const { data: res } = await this.$api.GetRightsByTree()
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败！')
            }
            this.rightsList = res.data

            this.getLeafKeys(role, this.defKeys)

            this.setRightDialogVisible = true
        },
        // 通过递归形式，获取角色所有三级权限的id,并保存到defKeys中
        getLeafKeys(node, arr) {
            // 叶子节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        setRightDialogClosed() {
            this.defKeys = []
        },
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys);
            const idStr = keys.join(',')
            // const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            const { data: res } = await this.$api.PostRolesSetting(this.roleId, idStr)
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败！')
            }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.setRightDialogVisible = false
        }
    },
}