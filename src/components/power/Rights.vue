<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="权限名称" prop="authName">
                </el-table-column>
                <el-table-column label="路径" prop="path">
                </el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级
                        </el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级
                        </el-tag>
                        <el-tag v-else type="warning">三级
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>
<script src="../../js/power/rights.js">
</script>
<style lang="less" scoped>
.el-card {
    margin-top: 15px;
}
</style>