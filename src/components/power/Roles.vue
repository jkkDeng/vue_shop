<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级三级权限 -->
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName">

                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">

                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
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
</script>
<style lang="less" scoped>
.el-card {
    margin-top: 15px;
}

.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>