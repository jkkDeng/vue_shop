export default {
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            // 商品分类数据
            cateList: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    // 表示当前定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                }, {
                    label: '排序',
                    // 表示当前定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'order'
                }, {
                    label: '操作',
                    // 表示当前定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'opt'
                }
            ],
            // 控制显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据
            addCateForm: {
                cat_name: '',
                // 父级分类
                cat_pid: 0,
                // 分类等级 默认是一级分类
                cat_level: 0,
            },
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类列表
            parentCateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
                // 运行一级选中
                checkStrictly: true
            },
            // 选中的父级分类数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$api.GetCateList(this.queryInfo)
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            console.log(res.data);
            this.cateList = res.data.result
            this.total = res.data.total
        },
        // 监听pagesize
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAddCateDialog() {
            this.getRarentCateList()
            this.addCateDialogVisible = true
        },
        async getRarentCateList() {
            const { data: res } = await this.$api.GetRarentCateList()
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类失败！')
            }
            console.log(res);
            this.parentCateList = res.data
        },
        // 选择项发生改变触发这个函数
        parentCateChanged() {
            console.log(this.selectedKeys);
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$api.PostAddCate(this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })

        },
        // 监听对话框的关闭
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }
    }
}