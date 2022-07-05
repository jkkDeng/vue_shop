export default {
    data () {
      return {
        // 登录表单的数据
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        // 表单验证规则
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 重置表单
      resetLoginForm () {
        // console.log(this);
        // loginFormRef  表单对象
        this.$refs.loginFormRef.resetFields()
      },
      login () {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return
          // const { data: res } = await this.$http.post('login', this.loginForm)
          const { data: res } = await this.$api.PostLoginApi(this.loginForm)
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败！')
            return
          }
          this.$message.success('登录成功！')
          // 登录成功之后将token保存到客户端的sessionStorage中
          // 这样只有当前网站打开期间生效
          // 通过编程式导航跳转到后台主页，/home
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      }
    }
  }