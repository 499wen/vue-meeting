<template>
    <div class="addperson">
      <el-form ref="userForm" class="userForm" :model="user" :rules="userRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input size='small' placeholder="请输入姓名" v-model="user.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="user.sex" class="full" placeholder="请选择" size='small'>
                <el-option v-for="(item,key) in sexOptions" :key="key" :label="item.value" :value="item.value"> 
                </el-option> 
              </el-select>
            </el-form-item>   
          </el-col> 
          <div class="userImage"> 
            <el-upload class="avatar-uploader" :action="`API.url + API.router.uploadFile`" :show-file-list="false" ref="updateFace"
            :headers="headers" accept="image/png,image/jpeg,image/jpg" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="user.photoFileSaveName" class="authsrc" id="addUserImg" style="width: 100%;height: 100%;border-radius: 0;" :authsrc="`${api}/${user.companyId}/${user.photoFileSaveName}`" alt="">

              <div class="tip" v-else>
                <div><i class="el-icon-plus avatar-uploader-icon"></i></div>
                <div>点击上传头像</div>
              </div>  
            </el-upload>
          </div>
        </el-row> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期" >
              <el-date-picker size='small' class="full" v-model="user.birthday" type="date" placeholder="请选择出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="民族">
              <el-input size='small' placeholder="请输入民族" v-model="user.nation">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="政治面貌">
              <el-input size='small' placeholder="请输入政治面貌" v-model="user.political">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="党派">
              <el-input size='small' placeholder="请输入党派" v-model="user.party">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学历">
              <el-select v-model="user.education" class="full" placeholder="请选择" size='small'>
                <el-option v-for="(item,key) in educationOptions" :key="key" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  >
            <el-form-item class="persoon_type">
              <el-radio v-model="user.externalCode" label= "0" >内部人员</el-radio>
              <el-radio v-model="user.externalCode" label= "1">外部人员</el-radio> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-input size='small' placeholder="请输入部门" v-model="user.oldDepartmentName">
              </el-input>
              <!-- <el-cascader size='small' v-model="user.departmentId" :options="departmentOptions" :props="departProps" clearable></el-cascader> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务">
              <el-input size='small' placeholder="请输入职务" v-model="user.duties">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-input size='small' placeholder="请输入角色" v-model="user.characterId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别">
              <el-input size='small' placeholder="请输入级别" v-model="user.ranksId">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input size='small' placeholder="请输入手机号" v-model="user.phone">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input size='small' placeholder="请输入email" v-model="user.email">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信">
              <el-input size='small' placeholder="请输入微信" v-model="user.weChat">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QQ">
              <el-input size='small' placeholder="请输入QQ" v-model="user.qq">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="家庭地址">
              <el-input size='small' placeholder="请输入家庭地址" v-model="user.homeAddress">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组别">
              <el-input size='small' placeholder="请输入组别" v-model="user.attribute1">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>

<script>
import addPeroson from './addPeroson.js'

export default addPeroson
</script>

<style scoped lang='less'>
.full {
  width: 100% !important;
}

.addperson {

  .userForm {
    height: calc(100% - 72px);
    overflow-y: auto;
    padding-right: 20px;
  }

	.userImage {
		width: 200px;
		height: 200px;
		position: absolute;
		right: 0;
    z-index: 90;
    display: flex;
    justify-content: center;

		.avatar-uploader {
      width: 150px;
      height: 188px;
      display: flex;
      justify-content: center;
      align-content: center;
      border: 1px dashed #ccc;
      border-radius: 5px;

			.tip {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
			}
		}
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 0.375rem;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 1.75rem;
		color: #8c939d;
		text-align: center;
	}

	.avatar {
		width: 100%;
		height: 100%;
		display: block;
  }
}

</style>