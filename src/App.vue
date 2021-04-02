<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created() {
    // 基准大小
    const baseSize = 16
    // 设置 rem 函数
    function setRem() {
      // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
      const width = document.documentElement.clientWidth
      const height = window.screen.height 
      const scale = height == 1080 ? 1 : width / 1920
      // 设置页面根节点字体大小 Math.min(scale, 2)
      document.documentElement.style.fontSize = baseSize * scale.toFixed(2) + 'px'
    }
    // 初始化
    setRem()
    // 改变窗口大小时重新设置 rem
    window.onresize = function() {
      setRem()
    }
  },
  mounted() {
    
  },
}
</script>

<style lang="less">
body {
  margin: 0;
  -moz-user-select:none; /*火狐*/
  -webkit-user-select:none; /*webkit浏览器*/
  -ms-user-select:none; /*IE10*/
  -khtml-user-select:none; /*早期浏览器*/
  user-select:none;
}

#app {
  font-family: Avenir,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #999 !important;
  z-index: 99 !important;
}

.el-table--border,
.el-table--group {
  border-color: #999 !important;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #999 !important;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #999 !important;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #999 !important;
  padding: 7px 0 !important;
}

.el-table .cell {
  width: 100%;
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap !important;
	display: inline-block;
}

.dialog {
  max-height: calc(100vh - 160px);
  box-sizing: border-box;
  min-width: 500px;
}

.el-dialog__body {
  max-height: calc(100vh - 214px) !important;
  box-sizing: border-box !important;
  padding: 0 !important;

  & > div {
    max-height: calc(100vh - 214px) !important;
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    overflow: auto;
  }
}

.dialog-btn {
  width: 100%;
  background-color: #fff;
  text-align: center;
  padding: 20px 0;
  box-sizing: border-box;
  border-radius: 0 0 2px 2px;
}

.el-dialog--center {
  margin-top: 80px !important;
}

// 顶部导航栏
.header-opera {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 0 15px;
  background-color: #ededed;

  .tap {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 40px;

    & > span {
      margin-right: 20px;
      position: relative;
      font-weight: 700;
      display: inline-block;
    }

    & > span:nth-last-child(1) {
      font-weight: 400;
      color: #606266;
    }

    & > span:before {
      content: '/';
      position: absolute;
      right: -10px;
      height: 100%;
      color: #a4a7ae;
    }

    & > span:nth-last-child(1):before {
      content: '';
    }
  }

  .look-more {
    color: #0000ee;
    font-size: 15px;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
  }
}
// 顶部导航栏 去除外边距
.special {
  margin-bottom: 0;
}


.pagin {
  width: 100%;
  padding-top: 10px;
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar {
	width: 8px;
	height: 4px;
	background-color: #f3f3f3;
}

::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 0.625rem;
	box-shadow: inset 0 0 0.3125rem #e3e3e3;
	background: #cecece;
}

::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	box-shadow: inset 0 0 0.3125rem #e3e3e3;
	border-radius: 0.625rem;
	background: #ededed;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

// 设置选中时 背景颜色
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #d0e7ff;
}

.btn_custom_cancel{
    float: right;
    margin-left: 10px !important;
}

.tangram-suggestion-main {
  z-index: 999;
}

// 去掉右边框
.el-menu {
  border-right: none !important;
}

// 
.el-button--small.is-round {
  padding: 7px 18px !important;
}

// 上传图片
.avatar-uploader {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;

  .self-explain {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;

    div {
      width: 100%;
      text-align: left;
      line-height: 25px;
    }
  }

  .avatar {
    width: 200px;
    height: 132px;
    border-radius: 5px;
    margin-right: 20px;
    border: 1px dashed #999;
    cursor: pointer;
    position: relative;

    & > img {
      width: 100%;
      height: 100%;
      border: 7px;
    }
  }
}

.img-pmt {
  display: inline-block;
  width: 480px;
  height: calc(100% - 50px);
  border: 1px dashed #999;
  position: relative;
}
.hide {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
