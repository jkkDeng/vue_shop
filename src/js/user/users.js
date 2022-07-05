export default {
    data() {
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前页显示多少条数据
                pagesize: 2,
            },
            userlist: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, { min: 3, max: 10, message: '用户名的长度在3~10个字符内' }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, { min: 3, max: 10, message: '密码的长度在3~10个字符内' }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息
            editForm: {},
            editFormRules: {
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }, {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            },
            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 需要分配角色的用户信息
            userInfo: {},
            // 所有角色的数据列表
            rolesList: [],
            // 已选中的roleId
            selectedRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            // const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            const { data: res } = await this.$api.GetUsers(this.queryInfo)
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.userlist = res.data.users
            this.total = res.data.total
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        async userStateChanged(userInfo) {
            console.log(userInfo);
            // const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            const { data: res } = await this.$api.PutUserStateSetting(userInfo.id, userInfo.mg_state)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            // 表单校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // const { data: res } = await this.$http.post('users', this.addForm)
                const { data: res } = await this.$api.PostAddUser(this.addForm)
                console.log(res);
                if (res.meta.status !== 201) {
                    return this.$message.error('添加用户状态失败！')
                }
                this.$message.success('添加用户成功！')
                this.addDialogVisible = false
                this.getUserList()
            })

        },
        // 展示修改用户对话框
        async showEditDialog(id) {
            // const { data: res } = await this.$http.get(`users/${id}`)
            const { data: res } = await this.$api.GetUserById(id)
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败！')
            }
            this.editForm = res.data
            console.log(this.editForm);
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                //     email: this.editForm.email,
                //     mobile: this.editForm.mobile
                // })                
                const { data: res } = await this.$api.PutUserSetting(this.editForm.id, this.editForm.email, this.editForm.mobile)
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败！')
                }
                this.$message.success('更新用户信息成功！')
                this.editDialogVisible = false
                this.getUserList()
            })

        },
        async removeUserById(id) {
            console.log(id);
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 确认 confirm
            // 取消 cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消')
            }
            // const { data: res } = await this.$http.delete('users/' + id)
            const { data: res } = await this.$api.DeleteUserById(id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getUserList()
        },
        async setRole(userInfo) {
            this.userInfo = userInfo
            // const { data: res } = await this.$http.get('roles')
            const { data: res } = await this.$api.GetRoles()
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesList = res.data

            this.setRoleDialogVisible = true
        },
        // 点击按钮
        async saveRoleInfo() {
            if (!this.selectedRoleId) {
                return this.$message.error('请选择要分配的角色！')
            }
            const { data: res } = await this.$api.PutUserRolesSetting(this.userInfo.id, this.selectedRoleId)
            if (res.meta.status !== 200) {
                return this.$message.error('更新角色失败！')
            }
            this.$message.success('更新角色成功！')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 关闭分配角色对话框
        setRoleDialogClosed() {
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}