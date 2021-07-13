<template>
	<div class="invitation not_select">
		<!-- 添加页面 -->
		<div class="iLeft">
			<!-- <div @click="generateQrCode">获取css</div> -->
			<div class="title">页面管理</div>
			<ul class="page_num_ul">
				<li v-for="(item,index) in dataCollection" :key="item.id" :class="{'page_num': true,'page_active': curPage == index + 1}"
				 @click="contentClick(index)">
					<div class="page_txt">第{{ index + 1 }}页
						<div class="deleteIcon" v-if="index != 0" @click.stop="deletePage(index)">×</div>
					</div>
					<!-- <p class="el-icon-close closeImg" v-if="index != 0" @click.stop="tempData.list.splice(index, 1),showKey = 0"></p> -->
				</li>
			</ul>  
			<div class="imgBtn">  
				<div class="pImg" @click="addPage">
					<img src="@/assets/images/addpageBtn.png" alt /> 
				</div>
				<p @click="addPage">添加页面</p>
				<!-- <p @click="presModel">保存模板</p> --> 
			</div>
		</div> 
 
		<!-- 手机模板 -->
		<div class="iContent flex">
			<!-- 元素 disabled-->
			<div class="drap-ele" v-if="!meetIsEnd">
					<ul class="verson text-area" draggable="true" @dragstart="textDrag($event)" @dragover="textDragover($event)" style="padding-left:0px;">
						<img class="invittext" src="@/assets/images/invittext.png" title="文本" />
						<!-- <li>文本</li> -->
					</ul>

					<ul class="pl20 verson" draggable="true" @dragstart="imageDrag($event)" @dragover="imageDragover($event)">
						<img class="invittext" src="@/assets/images/invitimages.png" title="图片" />
						<!-- <li>图片</li> -->
					</ul>

					<ul class="pl20 verson" @click="showSubmitForm">
						<img class="invittext" src="@/assets/images/invitTable.png" title="点击打开表单设置" />
						<!-- <li>表单</li> -->
					</ul>


					<ul v-if="false" class="pl20 verson" draggable="true" @dragstart="vdDrag($event)" @dragover="vdDragover($event)">x`
						<img class="invittext" src="@/assets/images/invitimages.png" title="视频" />
						<!-- <li>视频</li> -->
					</ul>
					<ul v-if="false" class="pl20 verson" draggable="true" @dragstart="vfDrag($event)" @dragover="vfDragover($event)">
						<img class="invittext" src="@/assets/images/invitimages.png" title="音频" />
						<!-- <li>音频</li> -->
					</ul>
					<ul v-if="false" class="pl20 verson" draggable="true" @dragstart="scoreDrag($event)" @dragover="scoreDragover($event)">
						<img class="invittext" src="@/assets/images/invitimages.png" title="评分" />
						<!-- <li>评分</li> -->
					</ul>
			</div>

			<div class="drap-ele disabled" v-else>
					<ul class="verson text-area">
						<img class="invittext" src="@/assets/images/invittext.png" title="文本" />
					</ul>

					<ul class="pl20 verson">
						<img class="invittext" src="@/assets/images/invitimages.png" title="图片" />
					</ul>

					<ul class="pl20 verson">
						<img class="invittext" src="@/assets/images/invitTable.png" title="点击打开表单设置" />
					</ul>
			</div>

			<div class="content-middle ml15 justify-center" style="padding-right: 15px;width:100%;">
				<div class="content-middle-type" v-if="false">
					<div class="pattern select" @click="pattern($event, 'multiPage')">多页模式</div> 
      		<div class="pattern" @click="pattern($event, 'longPage')">长页模式</div>
				</div>
				<!-- 长页邀请函 background-image: url(/zhenapi/fileserve/invitationFile/invitation/ +loginInfo.companyId+'/'+ dataCollection[curPage - 1].model.img +');' -->
				<div class="po-r phone-long" :style="'text-align:center;height:'+ dataCollection[curPage - 1].model.height +'px;background-image: url(' + API.echoImage(dataCollection[curPage - 1].model.img, 'Invitation') +');'" v-if="isLongPage">
					<div id="mc">
						<div id="phonecontent">
							<div class="phone-item" id="phone-item" :style="'height:'+ dataCollection[curPage - 1].model.height +'px;'" @drop="dropTest($event)"
							  @dragover="allowDrop($event)">
							</div>
						</div>
					</div>
					<div class="elongate" @mousedown="elongateDown">
						<div></div>
					</div>
					<div class="longpage_pixel" draggable="false" v-if="true">
						375 x <el-input-number size='small' v-model="dataCollection[curPage - 1].model.height" controls-position="right" class="longpage_pixel-height"></el-input-number> px
					</div>
					<!-- 鼠标悬停后展示二维码 -->
					<div class="show_qrcode" @click="openQrcode">
						<span v-if="codeVisible">收起</span>
						<span v-else>预览</span>
						<div class="qrcode_box" v-show="codeVisible">
							<p class="scan" style="margin:0 0 5px 0; width: 130px">扫码预览</p>
							<div class="align-center">
								<div id="qrcode" ref="qrcode" title=""></div>
							</div>
							<div class="bc-qrcode" @click.stop="preseQrcode"> 保存 </div>
						</div>
					</div>
				</div>
			</div>


		</div>

		<!-- 元素样式 -->
		<div class="iRight">
			<div class="invite-head justify-between" style="padding: 0 5px">
				<div class="flex" style="margin: 0 auto;">
					<!-- <ul class="pl20 verson" @click="levelCenter()">
						<li>居中</li>
					</ul> -->
					<ul class="pl20 verson big" @click="deformation($event, 'enlarge')">
						<img class="invittext" style="width: 30px; height: auto" src="@/assets/images/enlarge.png" title="点击打开背景样式" />
						<li>放大</li>
					</ul>
					<ul class="pl20 verson small" @click="deformation($event, 'narrow')">
						<img class="invittext" style="width: 30px; height: auto" src="@/assets/images/narrow.png" title="点击打开背景样式" />
						<li>缩小</li>
					</ul>
					<ul class="pl20 verson" @click="imgPopupToggle()">
						<img class="invittext" src="@/assets/images/invitbg.png" title="点击打开背景样式" />
						<li>背景库</li>
					</ul>
					<ul class="pl20 verson" @click="targDiv">
						<img class="invittext" width="30" height="30" src="@/assets/images/model.png" title="点击打开模板" />
						<li>模板库</li>
					</ul>
					<ul class="pl20 verson" v-if="!meetIsEnd" @click="save">
						<img class="invittext" width="30" height="30" src="@/assets/images/shangchuan.png" title="提交邀请函" />
						<li>保存</li>
					</ul>
					<ul class="pl20 verson" v-else style="cursor: not-allowed">
						<img class="invittext" width="30" height="30" src="@/assets/images/shangchuan.png" title="提交邀请函" />
						<li>保存</li>
					</ul>
				</div>

			</div>

			<!-- 图片与文本 -->
			<div id="templateStyle" v-if="tNode && (defaultStyle.type == 'invite-text' || defaultStyle.type == 'image') ">
				<el-collapse v-model="activeName">
					<el-collapse-item title="基本样式" name="1" style="padding-right: 0px;">
						<div class="layui-colla-content layui-show">
							<div v-if="!isImage" class="single">
								<!-- <div class="mb10 clear_float" style="text-align: left"> -->
								<div class="flex invite-progress" style="width: 100% !important">
									<ul style="margin-left: 3px;padding:0;" class="option flex">
										<li @click="defaultStyle.textAlign='left'" class="font_style">
											<img class="" src="@/assets/images/activeduiqi.png" style="background: #ee6363;" title="左对齐" v-if="defaultStyle.textAlign=='left'" />
											<img class="" src="@/assets/images/duiqi.png" title="左对齐" v-else />
										</li>

										<li @click="defaultStyle.textAlign='center'" class="font_style">
											<img class="" src="@/assets/images/activejuzhong.png" title="居中" style="background: #ee6363;"
											 v-if="defaultStyle.textAlign=='center'" />
											<img class="" src="@/assets/images/juzhongduiqi.png" title="居中" v-else />
										</li>

										<li @click="defaultStyle.textAlign='right'" class="font_style">
											<img class="" src="@/assets/images/activeduiqi_1.png" title="右对齐" style="background: #ee6363;"
											 v-if="defaultStyle.textAlign=='right'" />
											<img class="" src="@/assets/images/duiqi_1.png" title="右对齐" v-else />
										</li>
										<li @click="defaultStyle.fontWeight = ! defaultStyle.fontWeight" class="font_style">
											<img class="" style="background: #ee6363;" src="@/assets/images/activezitiyangshi_jiacu.png"
											 title="加粗" v-if="defaultStyle.fontWeight" />
											<img class="" src="@/assets/images/zitiyangshi_jiacu.png" title="加粗" v-else />
										</li>

										<li @click="defaultStyle.textDecoration= !defaultStyle.textDecoration" class="font_style">
											<img class="" src="@/assets/images/activezitiyangshi_xiahuaxian.png" style="background: #ee6363;"
											 v-if="defaultStyle.textDecoration" title="下划线" />
											<img class="" src="@/assets/images/zitiyangshi_xiahuaxian.png" title="下划线" v-else />
										</li>

										<li @click="defaultStyle.fontStyle = !defaultStyle.fontStyle" class="font_style">
											<img class="" src="@/assets/images/activezitiyangshi_xieti.png" style="background: #ee6363;" v-if="defaultStyle.fontStyle"
											 title="斜体" />
											<img class="" src="@/assets/images/zitiyangshi_xieti.png" title="斜体" v-else />
										</li>
										<div class="flex invite-progress" style="float:left;margin-left:10px;">
											<li class="flex top-floor mr20" style="margin: 0" @click="changeZindex(9)">
												<img style="margin-top: 6px;margin-right: 2px;" class="alignment-mode0" src="@/assets/images/roofplacement.png"
												 alt />
												<span>置顶</span>
											</li>
											<li class="flex top-floor" style="margin: 0" @click="changeZindex(1)">
												<img style="margin-top: 6px;margin-right: 2px;" class="alignment-mode0" src="@/assets/images/bottomsetting.png"
												 alt />
												<span>置底</span>
											</li>
										</div>
									</ul>
								</div>
									<div style="width: 50%; display: flex">
										<span class="mr15 style_label">字体</span>
										<el-select class="font_select mr10" size="mini" v-model="defaultStyle.fontFamily" style="width:100px;">
											<el-option value="黑体" selected="selected">黑体</el-option>
											<el-option value="宋体">宋体</el-option>
											<el-option value="微软雅黑">微软雅黑</el-option>
										</el-select>
									</div>
									<div style="width: 50%; display: flex">
										<span class="mr15 style_label">字号</span>
										<el-select v-model="defaultStyle.fontSize" size="mini" class="font_select mr10" style="width:100px;">
											<el-option value="12px">12px</el-option>
											<el-option value="13px">13px</el-option>
											<el-option value="14px">14px</el-option>
											<el-option value="16px">16px</el-option>
											<el-option value="18px">18px</el-option>
											<el-option value="20px">20px</el-option>
											<el-option value="24px">24px</el-option>
											<el-option value="32px">32px</el-option>
											<el-option value="48px">48px</el-option>
											<el-option value="64px">64px</el-option>
											<el-option value="96px">96px</el-option>
										</el-select>
									</div>
								<!-- </div> -->
								<div class="flex invite-progress">
									<span class="mr15 style_label">字距</span>
									<div class="ml15" style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.lineSpa" :max="50 * 1"></el-slider> -->
										<el-input-number v-model="defaultStyle.lineSpa" size="mini" style="width:100px;" controls-position="right" :min="0" :max="50"></el-input-number>
									</div>
								</div>
								<div class="flex invite-progress">
									<span class="mr15 style_label">行高</span>
									<div class="ml15" style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.lineHeight"></el-slider> -->
										<el-input-number v-model="defaultStyle.lineHeight" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

									</div>
								</div>
								<div class="flex invite-progress">
									<span class="mr15 style_label">透明度</span>
									<div style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.opacity"></el-slider> -->
										<el-input-number v-model="defaultStyle.opacity" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

									</div>
								</div>
								<div class="flex invite-progress" style="margin-left: 10px;justify-content: center;">
									<el-button v-preventReClick size='mini' @click="dengWidth">等宽</el-button>
								</div>
								<div class="flex invite-progress">
									<el-button v-preventReClick size='mini' @click="levelCenter">水平居中</el-button>
								</div>
								<div class="flex invite-progress" style="width: 100% !important">
									<span class="style_label mr10" style="width: 52px">字体颜色</span>
									<el-color-picker v-model="defaultStyle.textColor" size="medium" @change="textColorFilter"></el-color-picker>
									<!-- ffffff,ff5448,f2a653,ffca28,18cfa1,59c7f9,4d8ff3,7171ef,4f5975,000000 -->
									<div class="default_color_box">
										<div class="default_color" @click="setColor('text','#ffffff')" style="background-color:#ffffff;"></div>
										<div class="default_color" @click="setColor('text','#ff5448')" style="background-color:#ff5448;"></div>
										<div class="default_color" @click="setColor('text','#f2a653')" style="background-color:#f2a653;"></div>
										<div class="default_color" @click="setColor('text','#ffca28')" style="background-color:#ffca28;"></div>
										<div class="default_color" @click="setColor('text','#18cfa1')" style="background-color:#18cfa1;"></div>
										<div class="default_color" @click="setColor('text','#59c7f9')" style="background-color:#59c7f9;"></div>
										<div class="default_color" @click="setColor('text','#4d8ff3')" style="background-color:#4d8ff3;"></div>
										<div class="default_color" @click="setColor('text','#7171ef')" style="background-color:#7171ef;"></div>
									</div>
								</div>


								<!-- <div class="flex invite-progress" style="margin-top:10px;">
									<span class="style_label mr10">背景颜色</span>
									<el-color-picker v-model="defaultStyle.backColor" size="medium"></el-color-picker>
									<div class="default_color_box">
										<div class="default_color" @click="setColor('back','rgba(255,255,255,0)')" style="background-color:rgba(0,0,0,0);"></div>
										<div class="default_color" @click="setColor('back','#ffffff')" style="background-color:#ffffff;"></div>
										<div class="default_color" @click="setColor('back','#ff5448')" style="background-color:#ff5448;"></div>
										<div class="default_color" @click="setColor('back','#ffca28')" style="background-color:#ffca28;"></div>
										<div class="default_color" @click="setColor('back','#18cfa1')" style="background-color:#18cfa1;"></div>
										<div class="default_color" @click="setColor('back','#59c7f9')" style="background-color:#59c7f9;"></div>
										<div class="default_color" @click="setColor('back','#4d8ff3')" style="background-color:#4d8ff3;"></div>
										<div class="default_color" @click="setColor('back','#7171ef')" style="background-color:#7171ef;"></div>
										<div class="default_color" @click="setColor('back','#4f5975')" style="background-color:#4f5975;"></div>
										<div class="default_color" @click="setColor('back','#000000')" style="background-color:#000000;"></div>
									</div>
								</div> -->
							</div>
							<div v-if="isImage" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap">
								<!-- <el-upload class="upload-demo" drag action="/api/filecenter/file/file" :on-success="uploadImage" ref="elupload"
								 :headers="headers" accept="image/*" show-file-list="false">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">
										将图片拖到此处，或
										<em>点击上传</em>
									</div>
								</el-upload> -->
								<div class="flex invite-progress">
									<el-button v-preventReClick size='mini' @click="dengWidth">等宽</el-button>
								</div>
								<div class="flex invite-progress">
									<el-button v-preventReClick size='mini' @click="levelCenter">水平居中</el-button>
								</div>
								<div class="upload-demo">
									<el-button v-preventReClick size="mini" type="">点击上传</el-button>
          				<input type="file" name="" id="" class="hide" @change="uploadImage" ref="file_pmt">
								</div>
								
							
								<div style="width: 100%; display: flex;margin-top: 10px; justify-content: space-between; align-items: center; flex-wrap: wrap">
									<div class="flex invite-progress" style="width: 100% !important; line-height: 30px">
										<span class="mr15">透明度</span>
										<div style="display: inline-block;width: 100px">
											<!-- <el-slider v-model="opacity"></el-slider> -->
											<el-input-number v-model="defaultStyle.opacity" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

										</div>
									</div>
									<div class="flex invite-progress" style="width: 50%; margin:10px 0;">
										<li class="img-flex" @click="changeZindex(9)" style="width: 50px">
											<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/roofplacement.png"
											alt />
											<span>置顶</span>
										</li>
										<li class="img-flex top-floor" @click="changeZindex(1)">
											<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/bottomsetting.png"
											alt />
											<span>置底</span>
										</li>
									</div>
								</div>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item title="边框样式" name="2" style="padding-right: 0px;">
						<div class="layui-colla-content single">
							<div class="flex invite-progress">
								<span class="mr15 style_label">宽度</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.borderWidth" :max="20*1"></el-slider> -->
									<el-input-number v-model="defaultStyle.borderWidth" size="mini" style="width:100px;" controls-position="right" :min="0" :max="20"></el-input-number>
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label">弧度</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.borderRadius"></el-slider> -->
									<el-input-number v-model="defaultStyle.borderRadius" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>
								</div>
							</div>

							<div class="flex invite-progress">
								<span class="style_label mr10">颜色</span>
								<el-color-picker v-model="defaultStyle.borderColor" size="medium" @change="borderColorFilter"></el-color-picker>
								<div class="default_color_box" style="clear:both;">
									<div class="default_color" @click="setColor('border','#ffffff')" style="background-color:#ffffff;"></div>
									<div class="default_color" @click="setColor('border','#ff5448')" style="background-color:#ff5448;"></div>
									<div class="default_color" @click="setColor('border','#f2a653')" style="background-color:#f2a653;"></div>
									<div class="default_color" @click="setColor('border','#ffca28')" style="background-color:#ffca28;"></div>
									<div class="default_color" @click="setColor('border','#18cfa1')" style="background-color:#18cfa1;"></div>
									<div class="default_color" @click="setColor('border','#59c7f9')" style="background-color:#59c7f9;"></div>
									<div class="default_color" @click="setColor('border','#4d8ff3')" style="background-color:#4d8ff3;"></div>
									<div class="default_color" @click="setColor('border','#7171ef')" style="background-color:#7171ef;"></div>
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="style_label mr10">样式</span>
								<el-select v-model="defaultStyle.borderStyle" class="option" size="mini" style="margin-left: 5px;width:97px;height:35px;">
									<el-option value="none" label="无"></el-option>
									<el-option value="solid" label="直线"></el-option>
									<el-option value="dashed" label="虚线"></el-option>
									<el-option value="dotted" label="点状线"></el-option>
									<el-option value="double" label="双划线"></el-option>
								</el-select>
							</div>


						</div>
					</el-collapse-item>
					<el-collapse-item title="阴影样式" name="3" style="padding-right: 0px;">
						<div class="layui-colla-content single">
							<div class="flex invite-progress">
								<span class="mr15 style_label">大小</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowWidth"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowWidth" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

								</div>
							</div>
							
							<div class="flex invite-progress">
								<span class="mr15 style_label">模糊</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowDim"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowDim" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label">水平</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowDirectionV" :min="-50/1.0" :max="50/1.0"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowDirectionV" size="mini" style="width:100px;" controls-position="right" :min="-50" :max="50"></el-input-number>

								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label">垂直</span>
								<div style="display: inline-block;width: 100px">
									<el-input-number v-model="defaultStyle.shadowDirectionH" size="mini" style="width:100px;" controls-position="right" :min="-50" :max="50"></el-input-number>
									<!-- <el-slider v-model="defaultStyle.shadowDirectionH" :min="-50/1.0" :max="50/1.0"></el-slider> -->
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="style_label mr10">颜色</span>
								<el-color-picker v-model="defaultStyle.shadowColor" size="medium" @change="shadowColorFilter"></el-color-picker>
								<div class="default_color_box">
									<div class="default_color" @click="setColor('shadow','#ffffff')" style="background-color:#ffffff;"></div>
									<div class="default_color" @click="setColor('shadow','#ff5448')" style="background-color:#ff5448;"></div>
									<div class="default_color" @click="setColor('shadow','#f2a653')" style="background-color:#f2a653;"></div>
									<div class="default_color" @click="setColor('shadow','#ffca28')" style="background-color:#ffca28;"></div>
									<div class="default_color" @click="setColor('shadow','#18cfa1')" style="background-color:#18cfa1;"></div>
									<div class="default_color" @click="setColor('shadow','#59c7f9')" style="background-color:#59c7f9;"></div>
									<div class="default_color" @click="setColor('shadow','#4d8ff3')" style="background-color:#4d8ff3;"></div>
									<div class="default_color" @click="setColor('shadow','#7171ef')" style="background-color:#7171ef;"></div>
								</div>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>

			<!-- 视频与音频 -->
			<div id="templateStyle" v-if="tNode && (defaultStyle.type == 'vedio' || defaultStyle.type == 'audio') ">
				<el-collapse v-model="activeName">
					<el-collapse-item title="基本样式" name="1" style="padding-right: 0px;">
						<div class="layui-colla-content layui-show">
							<div style="display: flex; justify-content: space-between; align-items: center">
								<el-upload 
									v-if="defaultStyle.type == 'vedio'"
									class="upload-demo"
									:action="'API.url + API.router.imgupload'" :on-success="uploadVedio" ref="elupload"
								 :headers="headers" accept="video/*" :show-file-list="false"
								>
									<el-button v-preventReClick size="mini" type="">点击上传</el-button>
								</el-upload>

								<el-upload 
									v-if="defaultStyle.type == 'audio'"
									class="upload-demo"
									:action="'API.url + API.router.imgupload'" :on-success="uploadAudio" ref="elupload"
								 :headers="headers" accept="audio/*" :show-file-list="false"
								>
									<el-button v-preventReClick size="mini" type="">点击上传</el-button>
								</el-upload>

								<div class="flex invite-progress">
									<span class="mr15">透明度</span>
									<div style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="opacity"></el-slider> -->
										<el-input-number v-model="defaultStyle.opacity" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>
									</div>
								</div>
								<div class="flex invite-progress" style="float:left;margin:10px 0;">
									<li class="flex top-floor mr20" @click="changeZindex(9)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/roofplacement.png"
										 alt />
										<span>置顶</span>
									</li>
									<li class="flex top-floor" @click="changeZindex(1)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/bottomsetting.png"
										 alt />
										<span>置底</span>
									</li>
								</div>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
			
			<!-- 表单 -->
			<div id="templateStyle" v-if="defaultStyle.type == 'form'">
				<el-collapse v-model="activeName">
					<el-collapse-item title="表单样式" name="1" style="padding-right: 0px;">
						<div class="layui-colla-content layui-show">
							<div style="display: flex; justify-content: space-between; align-items: center" v-if="false">
								<div class="flex invite-progress" style="margin-left: 10px;justify-content: center;">
									<el-button v-preventReClick size='mini' @click="dengWidth">等宽</el-button>
								</div>
								<div class="flex invite-progress">
									<el-button v-preventReClick size='mini' @click="levelCenter">水平居中</el-button>
								</div>
								<div class="flex invite-progress" style="float:left;margin:10px 0;">
									<li class="flex top-floor mr20" @click="changeZindex(9)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/roofplacement.png"
										 alt />
										<span>置顶</span>
									</li>
									<li class="flex top-floor" @click="changeZindex(1)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="@/assets/images/bottomsetting.png"
										 alt />
										<span>置底</span>
									</li>
								</div>
							</div>

							<div class="sort">
								<span class="label">标题：</span>

								<div class="color">
									<span>文字颜色 </span>
									<el-color-picker v-model="defaultStyle.tipsColor" size="small" @change="tipsColor"></el-color-picker>
								</div>
							</div>

							<div class="sort">
								<span class="label">按钮：</span>

								<div class="color">
									<span>背景颜色 </span>
									<el-color-picker v-model="defaultStyle.btnBgcolor" size="small" @change="btnBgcolor"></el-color-picker>
								</div>
								<div class="color">
									<span>文本颜色 </span>
									<el-color-picker v-model="defaultStyle.textbtnBgcolor" size="small" @change="textbtnBgcolor"></el-color-picker>
								</div>
							</div>
							<div class="sort">
								<span class="label">文本框：</span>


								<div class="value">
									<div class="color">
										<span>内容颜色 </span>
										<el-color-picker v-model="defaultStyle.cteColor" size="small" @change="cteColor"></el-color-picker>
									</div>
									<div class="color">
										<span>背景颜色 </span>
										<el-color-picker v-model="defaultStyle.borderBgcolor" size="small" @change="borderBgcolor"></el-color-picker>
									</div>
									<div class="color">
										<span>边框颜色 </span>
										<el-color-picker v-model="defaultStyle.borderColor" size="small" @change="borderColor"></el-color-picker>
									</div>
								</div>
							</div>
							
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
			<!--  组件样式 end-->
		</div>

		<!-- 模板中存在的元素列 -->
		<div class="iRight mini_iRight" v-if="false">
			<el-collapse v-model="eleColumn" accordion>
				<el-collapse-item title="元素列" name="1">
					<div v-if="dataCollection[curPage - 1]">
						<div class="ele_btn clear_float" v-for="(item,index) in dataCollection[curPage - 1].eleList" :key="item.id">
							<el-button v-preventReClick size='small' @click="selectItem(item.id)" :id="'itemId'+item.id">{{item.nodeValue}}({{index+1}})</el-button>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<!-- 这里是文字的模板 start-->
		<div class="mr20 ml15">
			<div v-show="false" id="textTemplate" class="textTemplate" style="height:40px;width:60%">
				<div class="invite-text-box">
					<div class="invite-text-box-text edit-text" contenteditable="true">点击这里编辑</div>

					<!-- 右键列表 -->
					<div class="rightC-list currency" id="">
						<span class="del currency">删除</span>
					</div>

					<div class="invite-text-box-border">
						<div class="invite-text-box-border-container">
							<div class="invite-text-box-border top-line move-line">
								<div class="invite-text-box-border line-point s-resize top-line-point"></div>
							</div>

							<div class="invite-text-box-border left-line move-line">
								<div class="invite-text-box-border line-point left-line-point"></div>
							</div>

							<div class="invite-text-box-border right-line move-line">
								<div class="invite-text-box-border line-point right-line-point"></div>
							</div>

							<div class="invite-text-box-border bottom-line move-line">
								<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
							</div>

							<div class="invite-text-box-border left-top-point up-point"></div>
							<div class="invite-text-box-border right-top-point up-point"></div>
							<div class="invite-text-box-border left-bottom-point up-point"></div>
							<div class="invite-text-box-border right-bottom-point up-point"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 这里是文字的模板 end?-->

		<!--  这里是图片的模板 start-->
		<div v-show="false" id="imageTemplate" class="imageTemplate" style="height:150px;width:150px">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<div class="tip">请上传图片</div>
				</div>
				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是图片的模板 end-->

		<!--  这里是视频的模板 start-->
		<div v-show="false" id="vdTemplate" class="imageTemplate" style="height:150px;width:150px">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<video width="96%" height="96%" style="margin: 2%" controls>
						<!-- ../../public/static/mp4/oooo.mp4 -->
						<source src="" type="video/mp4">
					</video>
				</div>
				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是视频的模板 end-->

		<!--  这里是音频的模板 start-->
		<div v-show="false" id="vfTemplate" class="imageTemplate" style="height:150px;width:150px">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<audio style="margin: 2%" controls onselectstart="return false">
						<source src="" >
					</audio>
				</div>
				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是音频的模板 end-->

		<!--  这里是评分的模板 start-->
		<div v-show="false" id="scoreTemplate" class="imageTemplate" style="height:150px;width:60px">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<div class="score">
						<img src="@/assets/images/star01.png" draggable="false" alt="">
						<img src="@/assets/images/star01.png" draggable="false" alt="">
						<img src="@/assets/images/star01.png" draggable="false" alt="">
						<img src="@/assets/images/star01.png" draggable="false" alt="">
						<img src="@/assets/images/star01.png" draggable="false" alt="">
					</div>
				</div>
				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是评分的模板 end-->

		<!-- 这里是表单的模板 start-->
		<div v-show="false" id="formTemplate" class="formTemplate">
			<div class="invite-text-box">
				<div class="invite-text-box-text form">
					<div class="userName form-single">
						<span class="two-text white">姓名：</span>
						<input type="text" />
					</div>
					<div class="sex form-single">
						<span class="two-text white">性别：</span>
						<input type="text" />
					</div>
					<div class="company form-single">
						<span class="two-text white">单位：</span>
						<input type="text" />
					</div>
					<div class="department form-single">
						<span class="two-text white">部门：</span>
						<input type="text" />
					</div>
					<div class="post form-single">
						<span class="two-text white">职务：</span>
						<input type="text" />
					</div>
					<div class="email form-single">
						<span class="white">电子邮件：</span>
						<input type="text" />
					</div>
					<div class="phone form-single">
						<span class="white">手机号码：</span>
						<input type="text" />
					</div>
					<div class="checkNum form-single">
						<span class="white">验证码：</span>
						<div class="yzm">
							<input type="text" name="checkedCode">
							<div class="yzm-btn btn">获取验证码</div>
						</div>
					</div>
					<div class="submitForm form-single">
						<div class="submit btn">提 交</div>
					</div>
				</div>

				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是表单的模板 end-->
		<!-- 选择背景时的弹出层 @mousemove="box_move"-->
		<div class="popup_bg" v-show="popupVisible" >
			<div class="white_box">
				<div class="popup_titile">
					背景库
				</div>
				<div class="popup_bg-func">
					<el-button v-preventReClick size="small" type="danger" style="margin-right: 10px" @click="delBgimg">删除背景</el-button>
					<div class="upload-demo">
						<el-button v-preventReClick size="small" type="primary">上传背景</el-button>
          	<input type="file" name="" id="" class="hide" @change="bgiUpload" ref="file">
					</div>

				</div>
				<div class="popup_cente"> 
					<div class="popup_item" v-for="(item, idx) in bgImage" :key="idx">
						<img alt="" @click="changeBgImg(idx)" :class="[ (selectImg && selectImg.imgId == item.imgId) && 'select']"
						 :src="API.echoImage(item.imgId, 'Invitation')" @error="errImg(item.imgId, 'Invitation', $event)" >
						<!-- <div>
							<input type="radio" name="bgImgRadio" class="bgimage" id="bgimage" @click="changeBgImg(idx)">
						</div> -->
					</div>
				</div>

				<div class="popup_bottom">
					<el-button v-preventReClick size="small" type="primary" v-if="selectImg" @click="chioceImgRe">确定</el-button>
					<el-button v-preventReClick size="small" @click="closeBgi">关闭</el-button>
					
				</div>
			</div>
		</div>
		<!-- 背景弹出层end -->

		<!-- 选择模板时的弹出层 -->
		<div class="popup_bg" v-if="popupModel">
			<div class="white_box">
				<div class="popup_titile">
					模板库
				</div>
				<div class="popup_bg-func">
					<el-button v-preventReClick size="small" type="danger" @click="delModel">删除模板</el-button>
					<el-button v-preventReClick size="small" @click="presModel">保存模板</el-button>
				</div>
				<div class="popup_cente">

					<div class="popup_item" v-for="(item, idx) in invitaModel" :key="idx">
						<img :src="API.echoImage(item.imgId, 'Invitation')" alt="" @error="errImg(name, 'Invitation', $event)">
						<div>
							<input type="radio" name="bgImgRadio" class="radio" id="model" @click="changeBgModel(idx)">
						</div>
					</div>

				</div>

				<div class="popup_bottom">
					<el-button v-preventReClick size="small" v-if="selectModel" type="primary" @click="modelBtn">选择</el-button>
					<el-button v-preventReClick size="small" @click="closeModel">关闭</el-button>
				</div>
			</div>
		</div>
		<!-- 模板弹出层end -->

		<!-- 表单弹窗start -->
		<div class="form_bg" v-if="formConfigVisible">
			<div class="form_table">
				<div class="form_switch" >
					<div class="form_label">启用表单</div>
					<el-switch v-model="dataCollection[curPage - 1].formAttr.enable" :width="40" @change="initForm()" v-if="false">
					</el-switch>
				</div>
				<div v-show="dataCollection[curPage - 1].formAttr.enable">
					<div class="form_item" v-if="false">
						<div class="form_label">姓名：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.userName" :width="40" @change="initForm('userName')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">性别：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.sex" :width="40" @change="initForm('sex')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">单位：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.company" :width="40" @change="initForm('company')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">部门：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.department" :width="40" @change="initForm('department')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">职务：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.post" :width="40" @change="initForm('post')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">电子邮件：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.email" :width="40" @change="initForm('email')">
						</el-switch>
					</div>
				</div>
				<div class="form_btn" @click="formConfigVisible=false">关闭</div>
			</div>
		</div>
		<!-- 表单弹窗end -->

		<!-- 隐藏的 500px qrcode -->
		<div id="hideImg" ref="hideImg"></div>
	</div>
</template>

<script>
	import invitation from './invitation.js'

	export default invitation
</script>

<style lang="less" scoped>
@import url('./invitation.less');
</style>
