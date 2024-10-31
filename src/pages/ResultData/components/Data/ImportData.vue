<template>
  <div class="import-data">
    <div class="list-main">
      <el-form :model="dataInfo" label-position="top">
        <el-form-item label="数据名称">
          <el-input v-model="dataInfo.dataName" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="dataInfo.dataType" placeholder="请输入数据类型">
            <el-option label="倾斜摄影" value="1" />
            <el-option label="矢量数据" value="2" />
            <el-option label="遥感影像" value="3" />
            <el-option label="模型" value="4" />
            <el-option label="其它数据" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="外部数据链接">
          <el-input v-model="dataInfo.outerDataUrl" placeholder="请输入数据链接" />
        </el-form-item>
        <el-form-item label="内部数据链接">
          <el-input v-model="dataInfo.innerDataPath" placeholder="请输入数据链接" />
        </el-form-item>
        <el-form-item label="数据描述">
          <el-input v-model="dataInfo.dataDesc" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div class="list-footer">
      <el-button type="primary" @click="createData()">确定</el-button>
      <el-button type="primary" @click="closeImportData()" plain>取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { insertModelData } from "@/api/modelData";

// 生成时间戳
const getTimeStamp = () => {
  return Date.now()
};
// 表单
const dataInfo = reactive({
  dataName: '',
  dataType: '请输入数据类型',
  outerDataUrl: '',
  innerDataPath: '',
  dataDesc: '',
  workspaceId: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id
})
// 取消键
const emit = defineEmits(["closeImportData"]);
const closeImportData = () => {
  emit("closeImportData", false);
};
// 新增数据
const createData = () => {
  insertModelData(dataInfo as any).then(res => {
    console.log(res)
		if(res.code === 0) {
			ElMessage.success('新增数据成功！')
		}
    else {
      ElMessage.error('新增数据失败！')
    }
    emit("closeImportData", false);
	})
};
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.import-data {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.list-main {
  width: 100%;
  padding: 0px $ComponentGap;
}
.list-footer {
  width: 100%;
  height: 56px;
  border-top: $UsualBorder;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
