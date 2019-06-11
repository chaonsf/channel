import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Picker } from '@tarojs/components'
import './index.scss'
import { AtInput, AtForm,AtCheckbox,AtDrawer ,AtSearchBar,AtButton,AtPagination,AtToast,AtMessage,AtModal,AtSwitch} from 'taro-ui'

class Table extends Component {
      constructor(props){
          super(props)
      }
      componentDidMount(){
           this.props.fresh()
      }
      render(){
          return(
              <view className="table">
                      <view className="tr at-row">
                          <view className="th at-col at-col-7">渠道(财务)</view>
                          <view className="th at-col at-col-5">渠道(系统)</view>
                      </view>
                      {this.props.tables.map((table)=>
                                <view className="tr at-row" onClick={()=>this.props.onChange(table.CHANNEL_ID,table.CHANNEL_NAME)}>
                                      <view className="td at-col at-col-7 at-col--wrap">{table.CHANNEL_NAME}</view>
                                      <view className="td at-col at-col-5 at-col--wrap'">{table.SGSG_NAME}</view>
                                </view>
                        )}
              </view>
          )
                      
      }
}
class ProductTable extends Component{
    constructor(props){
         super(props)
    }
    componentDidMount(){
        this.props.fresh()
    }
    render(){
       return(
          <view className="table">
               <view className="tr at-row">
                  <view className="th at-col at-col-4">编码</view>
                  <view className="th at-col at-col-5">产品名称</view>
                  <view className="th at-col at-col-3">价格</view>
               </view>
               {this.props.productTables.map((table)=>
                   <view className="tr at-row" onClick={()=>this.props.onChange(table.PDPD_ID,table.PDPD_NAME,table.PRICE)}>
                         <view className="td at-col at-col-4 at-col--wrap">{table.PDPD_ID}</view>
                         <view className="td at-col at-col-5 at-col--wrap">{table.PDPD_NAME}</view>
                         <view className="td at-col at-col-3 at-col--wrap">{table.PRICE}</view>
                   </view>
                  )}
          </view>
       )
    }
}
export default class Index extends Component {
   constructor(props){
       super(props);
       this.state={
             form:{
                SVC_NAME:"", //处置内容
                CHANNEL_NAME:"", //渠道名称
                CHANNEL_ID:"", //渠道id
                PDPD_ID:"",   //产品ID
                PDPD_NAME:"", //产品名称
                OPERATOR:"",//经办人
                FACE_AMOUNT:"", //入账金额
                COST:"", //成本
                QTY:1,  //数量
                INCOME_TYPE:{value: "WEIXIN", name: "微信二维码"},//入账方式
                INCOME_NO:"",//凭证说明
                MEME_NAME:"",//姓名
                MEME_CERT_ID_NUM:"", //证件号
                MEME_CELL_PHONE:"", //手机号
                VIP_IND:[],//是否是vip客户
                COMMENT:"",//说明备注
             },
             INCOME_Array:[
                 {value:"WEIXIN",name:"微信二维码"},
                 {value:"POS",name:"POS机"},
                 {value:"BANK_TRANS",name:"银行转账"},
                 {value:"CASH",name:"现金"}
             ], //入账方式数据
             popup:false,//控制渠道选择的弹窗显示隐藏
             Query:"",
             tables:[
             ],
             tableTotal:0,  //总数
             pageSize:7,   //每页条数
             currentPage:1,
             productPop:false,//控制产品选择的弹窗显示隐藏
             produQuery:"" ,//产品输入框
             productTables:[],//产品表格数据
             loading:false,
             moduleShow:false,//模态框的显示隐藏
             title:"",//模态框的标题
             moduleID:"",// 1代表清空内容 2代表保存
             timeshow:false, //是否已入账，钩住代表入账时间要填写(必填)
             
       }
       this.checkboxOptions=[
            {value: 'true',
            label: 'vip客户',}
       ]
   }
  config = {
    navigationBarTitleText: '渠道入账'
  }

  componentWillMount () {
   let params=this.$router.params;
    let arr=Object.keys(params);
    if(arr.length>0){  //代表传过来得不是空对象
      let obj={
         DB_NAME:"DENTAL_CUSTOMER_SERVICE",
         SP_NAME:"SP_EXTRA_ACCOUNT_INFO_SELECT",
         m:"SELECT",
         ACC_KY:params.ACC_KY
       }
        Taro.request({
         url:"../../base/query",
         data:obj,
         method:"POST",
         credentials:"include",
         header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res=>{
            let data=res.data[0];
            let type={value: "WEIXIN", name: "微信二维码"}
            if(data.INCOME_TYPE){
               type=this.state.INCOME_Array.find((item)=>{
                  return item.value==data.INCOME_TYPE
                })
            }
            if(data.INCOME_IND=="Y"){ //代表录入了入账时间
               this.setState({
                  timeshow:true
                },()=>{
                    this.refs.time.value=data.INCOME_DATE.replace(" ","T")
                })
            }
             let vip
             if(data.VIP_IND=="Y"){
                 vip=["true"]
             }else{
                vip=[]
             }
             this.setState({
                 form:Object.assign({},this.state.form,{
                      SVC_NAME:data.SVC_NAME,
                      CHANNEL_NAME:data.CHANNEL_NAME,
                      CHANNEL_ID:data.CHANNEL_ID,
                      PDPD_ID:data.PDPD_ID,
                      PDPD_NAME:data.PDPD_NAME,
                      OPERATOR:data.OPERATOR,
                      FACE_AMOUNT:data.FACE_AMOUNT,
                      COST:data.COST,
                      QTY:data.QTY,
                      INCOME_TYPE:type,
                      INCOME_NO:data.INCOME_NO,
                      MEME_NAME:data.MEME_NAME,
                      MEME_CERT_ID_NUM:data. MEME_CERT_ID_NUM,
                      MEME_CELL_PHONE:data.MEME_CELL_PHONE,
                      VIP_IND:vip,
                      COMMENT:data.COMMENT
                 })
             })
        })
    }

   }

  componentDidMount () { 

  }

  componentWillUnmount () { 
    
  }

  componentDidShow () { }

  componentDidHide () { }
  typeChange=e=>{
     this.setState({
         form:Object.assign({},this.state.form,{"INCOME_TYPE":this.state.INCOME_Array[e.detail.value]})
     })
  }
  onChange(key,value){
      this.setState({
          form:Object.assign({},this.state.form, { [key]: value })
      })
  }
  queryChange(key,value){ //两个抽屉里的搜索框的onChange
     this.setState({
         [key]:value
     })
  }
  produChange(value){
      this.setState({
          produQuery:value
      })
  }
  selectDitch(){  //点击选择渠道
      this.setState({
         popup:true
      })
     
     
  }
  product(){   //点击选择产品
     this.setState({
        productPop:true
     })
  }
  onActionClick(){ //渠道搜素
   let obj={
        DB_NAME:"DENTAL_CONFIG",
        SP_NAME:"SP_CHANNEL_8SALE_GROUP_USABLE_SALE_LIST",
        m:"LIST",
        rows:this.state.pageSize,
        page:this.state.currentPage,
        SGSG_NAME:this.state.Query
    } 
    this.setState({
        loading:true
    })
    Taro.request({
      url:"../../base/query",
      data:obj,
      method:"POST",
      credentials:"include",
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
    }).then(res=>{
        let rows=res.data.rows;
        this.setState({
           loading:false,
           tables:rows,
           tableTotal:res.data.total
        })
    })
  }
  onPageChannel(data){ //渠道的页面切换
      this.setState({
         currentPage:data.current
      },()=>{
         this.onActionClick()
      })
  }
  onPageChange(data){//产品的页面切换
     console.log(data);
     this.setState({
       currentPage:data.current
     },()=>{
        this.productSearch()
     })
  }
  onClose(){
     this.setState({
        popup:false,
        productPop:false,
        tableTotal:0,
        currentPage:1
     })
  }
  onTabChange(id,name){  //钩中checkbox选择好渠道
     console.log("渠道id:",id);
     this.setState({
         form:Object.assign({},this.state.form,{CHANNEL_NAME:name,CHANNEL_ID:id,PDPD_NAME:"", PDPD_ID:""}),
         popup:false,
         currentPage:1,
         tableTotal:0
     })
  }
  productSearch(){  //点击搜索产品
    let obj={
      DB_NAME:"DENTAL_CONFIG",
      SP_NAME:"SP_PRODUCT_8CHANNEL_USABLE_SALE_LIST",
      m:"LIST",
      rows:this.state.pageSize,
      page:this.state.currentPage,
      CHANNEL_ID:this.state.form.CHANNEL_ID,
      PDPD_NAME:this.state.produQuery
    }
    this.setState({
       loading:true
    })
    Taro.request({
      url:"../../base/query",
      data:obj,
      method:"POST",
      credentials:"include",
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
    }).then(res=>{
        let data=res.data;
        this.setState({
            loading:false,
           tableTotal:data.total,
           productTables:data.rows
        })
    })
      
  }
  onProductSelect(id,name,price){//钩住checkbox选中产品
       this.setState({
          form:Object.assign({},this.state.form,{PDPD_ID:id,PDPD_NAME:name,FACE_AMOUNT:price}),
          productPop:false,
          currentPage:1,
          tableTotal:0

       })
  }
  save(){ //保存,除了处置内容，凭证说明，说明其他都是必填
     this.setState({
         title:"是否确定保存?",
         moduleShow:true,
         moduleID:2
     })

  }
  add(data){
     this.setState({
         loading:true
     })
     let arr={
         SP_NAME:"SP_EXTRA_ACCOUNT_INFO_INSERT",
         m:"INSERT",
         DB_NAME:"DENTAL_CUSTOMER_SERVICE"
     }
     let obj=Object.assign(arr,data)
     Taro.request({
      url:"../../base/query",
      data:obj,
      method:"POST",
      credentials:"include",
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
     }).then(res=>{
        this.setState({
            loading:false
        })
        let data=res.data;
        if(data.RETURN_CODE==0){
          Taro.atMessage({
            "message":data.RETURN_MESSAGE,
            "type":"success"
           })
           this.setState({
            form:Object.assign({},{SVC_NAME:"",
            CHANNEL_NAME:"",
            CHANNEL_ID:"",
            PDPD_ID:"",   
            PDPD_NAME:"", 
            OPERATOR:"",
            FACE_AMOUNT:"", 
            COST:"",
            QTY:1,  
            INCOME_TYPE:{value: "WEIXIN", name: "微信二维码"},
            INCOME_NO:"",
            MEME_NAME:"",
            MEME_CERT_ID_NUM:"",
            MEME_CELL_PHONE:"", 
            VIP_IND:[],
            COMMENT:"",
            INCOME_DATE:""
          }),
        })
        }else{  //新增不成功
         Taro.atMessage({
            "message":data.RETURN_MESSAGE,
            "type":"error"
           })
        }


     })
  }
  edit(data){
       let key=this.$router.params.ACC_KY;
       let params={
           DB_NAME:"DENTAL_CUSTOMER_SERVICE",
           SP_NAME:"SP_EXTRA_ACCOUNT_INFO_UPDATE",
           m:"UPDATE",
           ACC_KY:key
       }
       let obj=Object.assign(params,data)
       Taro.request({
         url:"../../base/query",
         data:obj,
         method:"POST",
         credentials:"include",
         header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
       }).then(res=>{
           let data=res.data;
           if(data.RETURN_CODE==0){
             Taro.navigateTo({
               url: '/pages/manage/index'
              })
           }else{
            Taro.atMessage({
               "message":data.RETURN_MESSAGE,
               "type":"error"
              })
           }
       })
  }
  clear(){
    this.setState({
       moduleShow:true,
       title:"是否确定清空?",
       moduleID:1
    })
  }
  handleConfirm(){ //模态框的确定
   let title=this.state.moduleID;
   this.setState({
       moduleShow:false
   })
   if(title==1){ //代表清除
      this.setState({
         form:Object.assign({},{SVC_NAME:"",
         CHANNEL_NAME:"",
         CHANNEL_ID:"",
         PDPD_ID:"",   
         PDPD_NAME:"", 
         OPERATOR:"",
         FACE_AMOUNT:"", 
         COST:"",
         QTY:1,  
         INCOME_TYPE:{value: "WEIXIN", name: "微信二维码"},
         INCOME_NO:"",
         MEME_NAME:"",
         MEME_CERT_ID_NUM:"",
         MEME_CELL_PHONE:"", 
         VIP_IND:[],
         COMMENT:"",
       }),
       moduleShow:false,
       timeshow:false
     })
   }else if(title==2){
      //代表保存
      let ind;
      if(this.state.form.VIP_IND.length==1){
          ind="Y"
      }else{
         ind="N"
      }
     let data=Object.assign({},this.state.form,{INCOME_TYPE:this.state.form.INCOME_TYPE.value,VIP_IND:ind});
     if(this.state.timeshow){
      let time=this.refs.time.value;
       if(!time){
         Taro.atMessage({
            'message': '请填写入账时间',
            'type': "warning",
          })
          return
       }
       let re=/T/g;
       data.INCOME_DATE=time.replace(re," ")
     }
     console.log("数据:",data);
     if(!data. CHANNEL_ID || !data.PDPD_ID ||!data.FACE_AMOUNT || !data.COST || !data.QTY || !data.MEME_NAME ||!data.MEME_CERT_ID_NUM || !data. MEME_CELL_PHONE ||!data.OPERATOR){
       Taro.atMessage({
         'message': '请填写完整',
         'type': "warning",
       })
       return 
     }
     let params=this.$router.params;
     let arr=Object.keys(params);
     if(arr.length==0){
          this.add(data)
     }else{
         this.edit(data)  
     }
     
   }

  }
  handleCancel(){
     this.setState({
        moduleShow:false
     })
  }
  channel(){ //点击渠道入账管理
    Taro.navigateTo({
        url: '/pages/manage/index'
      })
  }
  handleChange(){
      let bool=this.state.timeshow
       this.setState({
          timeshow:!bool
       },()=>{
           this.refs.time.value=""
       })
  }
  render () {
    return (
      <View className='index'>
          <Text className="biaoti">渠道入账</Text>
          <Text className="title" onClick={this.channel.bind(this)}>渠道入账管理 <i className="at-icon at-icon-chevron-right"></i></Text>
          <AtForm className="content">
              <AtInput className="ness" title="渠道" value={this.state.form.CHANNEL_NAME} onChange={this.onChange.bind(this,"CHANNEL_NAME")} editable={false} onClick={this.selectDitch.bind(this)} placeholder="点击右侧按钮选择渠道">
                 <Text className='btn'>选择渠道</Text>
              </AtInput>
              <AtInput className="ness" title="产品" value={this.state.form.PDPD_NAME} onChange={this.onChange.bind(this,"PDPD_NAME")} editable={false} onClick={this.product.bind(this)} placeholder="点击右侧按钮选择产品">
                 <Text className='btn'>选择产品</Text>
              </AtInput>
              <AtInput title="处置内容" placeholder="输入处置内容" value={this.state.form.SVC_NAME} onChange={this.onChange.bind(this,"SVC_NAME")}></AtInput>
              <AtInput title="数量" value={this.state.form.QTY} onChange={this.onChange.bind(this,"QTY")} type="number" editable={false}></AtInput>
              <AtInput className="ness" title="经办人" placeholder="输入经办人" value={this.state.form.OPERATOR} onChange={this.onChange.bind(this,"OPERATOR")}></AtInput>
              <AtSwitch title='是否进账' checked={this.state.timeshow} onChange={this.handleChange.bind(this)}  border={false}/>
              <view  className={`at-row at-row--wrap pad ${this.state.timeshow}`}>
                  <Text className="at-input__title time">入账时间</Text><input type="datetime-local" className="weui-input at-input__input" ref="time"></input>
              </view>
              <view className="incomeType">
              <Picker mode='selector' range={this.state.INCOME_Array} onChange={this.typeChange} rangeKey="name" className="pad">
              <Text className="pickerTitle">入账方式</Text>
                <View className='picker'>
                   {this.state.form.INCOME_TYPE.name}
                   <i className="at-icon at-icon-chevron-down"></i>
                </View>
               </Picker>
              </view>
              <AtInput title="凭证说明" placeholder="凭证说明" value={this.state.form.INCOME_NO} onChange={this.onChange.bind(this,"INCOME_NO")}></AtInput>
              <AtInput className="ness" title="入账金额" placeholder="入账金额" value={this.state.form.FACE_AMOUNT} onChange={this.onChange.bind(this,"FACE_AMOUNT")} type="number"></AtInput>
              <AtInput className="ness" title="成本" placeholder="成本" value={this.state.form.COST} onChange={this.onChange.bind(this,"COST")} type="number"></AtInput>
             
               <view class="at-row">
               <AtInput className="ness at-col at-col-8" title="姓名" placeholder="输入姓名" value={this.state.form.MEME_NAME} onChange={this.onChange.bind(this,"MEME_NAME")}></AtInput>
               <AtCheckbox className="at-col at-col-4" options={this.checkboxOptions} selectedList={this.state.form.VIP_IND} onChange={this.onChange.bind(this,"VIP_IND")}></AtCheckbox> 
               </view>
              <AtInput className="ness" title="证件号" placeholder="输入证件号" value={this.state.form.MEME_CERT_ID_NUM} onChange={this.onChange.bind(this,"MEME_CERT_ID_NUM")}></AtInput>
              <AtInput className="ness" title="手机" placeholder="输入手机号" value={this.state.form.MEME_CELL_PHONE} onChange={this.onChange.bind(this,"MEME_CELL_PHONE")} type="phone"></AtInput>
              <AtInput  title="说明" placeholder="备注说明" value={this.state.form.COMMENT} onChange={this.onChange.bind(this,"COMMENT")}></AtInput>
          </AtForm>
           <view className="at-row footer">
             <AtButton type='secondary' className='at-col' onClick={this.clear.bind(this)}>清空内容</AtButton>
              <AtButton type='primary' className='at-col' onClick={this.save.bind(this)}>保存</AtButton>
           </view>
           <AtDrawer show={this.state.popup} width="90%" right={true} onClose={this.onClose.bind(this)}>
               <AtSearchBar  showActionButton={true} actionName="搜索渠道"  value={this.state.Query} onChange={this.queryChange.bind(this,"Query")} onActionClick={this.onActionClick.bind(this)}></AtSearchBar>
               <view className="container">
                    <Table tables={this.state.tables} onChange={(id,name)=>this.onTabChange(id,name)} fresh={()=>this.onActionClick()}></Table>
               </view>
               <AtPagination total={this.state.tableTotal} pageSize={this.state.pageSize} current={this.state.currentPage} onPageChange={this.onPageChannel.bind(this)}></AtPagination>
               <AtButton type='primary' className="close" onClick={this.onClose.bind(this)}>关闭</AtButton>  
          </AtDrawer>
          <AtDrawer show={this.state.productPop} width="90%" right={true} onClose={this.onClose.bind(this)}>
             <AtSearchBar  showActionButton={true} actionName="搜索产品"  value={this.state.produQuery} onChange={this.queryChange.bind(this,"produQuery")} onActionClick={this.productSearch.bind(this)}></AtSearchBar>
             <view className="container">
                 <ProductTable productTables={this.state.productTables} onChange={(id,name,price)=>this.onProductSelect(id,name,price)} fresh={()=>this.productSearch()}></ProductTable>
             </view>
             <AtPagination total={this.state.tableTotal} pageSize={this.state.pageSize} current={this.state.currentPage} onPageChange={this.onPageChange.bind(this)}></AtPagination>
             <AtButton type='primary' className="close" onClick={this.onClose.bind(this)}>关闭</AtButton>  
          </AtDrawer>
          <AtMessage />
          <AtToast isOpened={this.state.loading} text="正在加载" icon="at-icon at-icon-loading-2" hasMask duration={0} status="loading"></AtToast>
          <AtModal isOpened={this.state.moduleShow} cancelText='取消' confirmText='确认'  onConfirm={ this.handleConfirm.bind(this) } title={this.state.title} onCancel={ this.handleCancel.bind(this) }></AtModal>
      </View>
    )
  }
}
