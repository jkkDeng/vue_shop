<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">
                    <i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
                </div>
                <!-- 侧边栏菜单区域 -->
                <el-menu :unique-opened="true" :default-active="activePath" :collapse="isCollapse"
                    :collapse-transition="false" background-color="#292b34" text-color="#fff"
                    active-text-color="#409eff" router>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <i :class="iconlist[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--  -->
            <el-main>
                <!-- 路由展位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>

    </el-container>
</template>
<script src="../js/home.js">

</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #292b34;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0px;
    font-size: 20px;
    color: white;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background: #292b34;
    transition: 0.5s;

    .el-menu {
        border-right: none;
    }
}

.el-main {
    background: #d7d6d6;
}

.iconfont {
    margin-left: 10px;
}

.toggle-button {
    background: #62677e;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
