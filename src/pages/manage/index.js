import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Picker } from '@tarojs/components'
import './index.scss'
import {AtCard ,AtSearchBar,AtButton,AtToast,AtMessage,AtModal} from 'taro-ui'
import moment from 'moment'
class Card extends Component{
     constructor(props){
         super(props)
     }
     componentDidMount(){
     
     }
     render(){
         return(
            <view className="contents" onScroll={this.props.scroll}>
                  { this.props.listArray.map((item)=>
                     <AtCard>
                          
                           <view className="at-row at-row--wrap">
                                <view className="at-col at-col-4"><Text>渠道:</Text></view>
                                <view className="at-col at-col-8 right">{item.CHANNEL_NAME}</view>
                                <view className="at-col at-col-4"><Text>产品:</Text></view>
                                <view className="at-col at-col-8 right">{item.PDPD_NAME}*{item.QTY}</view>
                                <view className="at-col at-col-4"><Text>录入时间:</Text></view>
                                <view className="at-col at-col-8 right">{item.CREATE_DATE}</view>
                            </view>
                            {item.INCOME_IND=="Y"?(<view className="at-row at-row--wrap"><view className="at-col at-col-4"><Text>入款时间:</Text></view><view className="at-col at-col-8 right">{item.INCOME_DATE}</view></view>):(<view className="dn"></view>)}
                            <view className="at-row at-row--wrap"> 
                                <view className="at-col at-col-6"><Text>购买价:</Text> {item.FACE_AMOUNT}</view>
                                <view className="at-col at-col-6 right"><Text>成本价:</Text> {item.FACE_AMOUNT}</view>
                                <view className="at-col at-col-6 "><Text>入款方式:</Text> {item.INCOME_TYPE_DESC}</view>
                                <view className="at-col at-col-6 right"><Text>经办人:</Text> {item.OPERATOR}</view>
                                <view className="at-col at-col-12"><Text>凭证说明:</Text> {item.INCOME_NO}</view>
              
                                <view className="at-col at-col-12 blue"><Text>姓名:</Text> {item.MEME_NAME}</view>
                                <view className="at-col at-col-4"><Text>证件号:</Text></view>
                                <view className="at-col at-col-8 right">{item.MEME_CERT_ID_NUM}</view>
                                <view className="at-col at-col-6"><Text>vip:</Text>{item.VIP_IND=="Y"?(<view>是</view>):(<view>否</view>)}</view>
                                <view className="at-col at-col-6 right"><Text>手机:</Text>{item.MEME_CELL_PHONE}</view>
                                <view className="at-col at-col-4"><Text>备注:</Text></view>
                                <view className="at-col at-col-8 right">{item.COMMENT}</view>
                           </view>
                           {item.CARD_ID==""?(<view className="dn"></view>):(<view className="at-row at-row--wrap blue"><view className="at-col at-col-4">卡号</view><view className="at-col at-col-8 right">{item.CARD_ID}</view></view>)}
                           {item.ACC_STATUS!="CREATED" && !item.CARD_ID?(<view className="at-row"><AtButton type='primary' size='small'  className="at-col at-col-12" onClick={()=>this.props.onEdit(item.ACC_KY)}>修改</AtButton></view>):(<view className="dn"></view>)}
                           {item.ACC_STATUS=="CREATED" && !item.CARD_ID?(<view className="at-row"><AtButton type='primary' size='small'  className="at-col at-col-6" onClick={()=>this.props.onEdit(item.ACC_KY)}>修改</AtButton> <AtButton type='secondary' size='small'  className="at-col at-col-6" onClick={()=>this.props.onCancel(item.ACC_KY)}>撤销</AtButton></view>):(<view className="dn"></view>)}
                     </AtCard>
                  )

                  }
            </view>
         )
     }
}
export default class Index extends Component {
   constructor(props){
       super(props);
       this.state={
             loading:false,
              moduleShow:false,
              title:"",
              Query:"",
              timeArray:[
                  {value:"today",name:"当天"},
                  {value:"threeDays",name:"近三天"},
                  {value:"thisMonth",name:"本月"},
                  {value:"lastMonth",name:"上月"},
                  {value:"thisYear",name:"本年"}
              ],
              timeType:{value:"today",name:"当天"},
              payArray:[
                 {value:"",name:"全类型"},
                 {value:"UNACCOUNT,",name:"未入账"},
                 {value:"NO_ACTIVE,",name:"异常案件"},
                 {value:"NO_PDPD_ID,",name:"治疗流水"}
              ],
              payWay: {value:"",name:"全类型"},
              listArray:[], //列表显示
              ACC_KY:"",  //撤销时记得key
              total:0, //滚动加载数据总条数
              pageSize:10,//每次加载条数
              currentPage:1,  //当前页数
              
             
       }
   }
  config = {
    navigationBarTitleText: '渠道入账管理'
  }

  componentWillMount () { }
  componentDidMount () {
    let cache=localStorage.getItem("key");
    if(cache){
        let cacheF=JSON.parse(cache);
        this.setState({
            timeType:cacheF[0],
            payWay:cacheF[1],
            Query:cacheF[2].Query
        },()=>{
           this.beforesearch();
           localStorage.removeItem("key")
        })
    }else{
      this.beforesearch()
    }
     
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  queryChange(key,value){  //search的搜索框
    this.setState({
        [key]:value
    })
  }
  handleConfirm(){
     let obj={
         SP_NAME:"SP_EXTRA_ACCOUNT_INFO_DELETE",
         m:"DELETE",
         DB_NAME:"DENTAL_CUSTOMER_SERVICE",
         ACC_KY:this.state.ACC_KY
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
         this.setState({
            ACC_KY:"",
            moduleShow:false,
            loading:false
         })
        if(res.data.RETURN_CODE==0){
            Taro.atMessage({
              'message':res.data.RETURN_MESSAGE,
              'type':"success"
            })
            this.beforesearch()
        }else{
          Taro.atMessage({
            "message":res.data.RETURN_MESSAGE,
            "type":"error"
           })
        }
     })
  }
  handleCancel(){
     this.setState({
       ACC_KY:"",
       moduleShow:false
     })
  }
  beforesearch(){ //点搜索框，撤销等都通过此函数重置一下在刷新 
      this.setState({
          currentPage:1,
          total:0,
          listArray:[]
      },()=>{
          this.search()
      })
  }
  search(){ //只要是新增得状态就显示两个按钮,其他状态不显示
    let timeType=this.state.timeType.value;
    let params=this.transform(timeType);
     let mid={
        SP_NAME:"SP_EXTRA_ACCOUNT_INFO_SALE_LIST",
        m:"LIST",
        DB_NAME:"DENTAL_CUSTOMER_SERVICE",
        Query:this.state.Query,
        SWTICH:this.state.payWay.value,
        rows:this.state.pageSize,
        page:this.state.currentPage
     }
     let obj=Object.assign(params,mid)
     this.setState({
         loading:true
     })
    Taro.request({
       url:"../../base/query",
       data:obj,
       method:"POST",
       credentials:"include",
       header: {
         'Content-Type':'application/x-www-form-urlencoded'
       }
    }).then(res=>{
         let data=res.data.rows;
         this.setState({
           listArray:this.state.listArray.concat(data),
           loading:false,
           total:res.data.total
         })
    })
    
  }
  typeChange=e=>{
    this.setState({
        timeType:this.state.timeArray[e.detail.value]
    })
 }
 payChange=e=>{
     this.setState({
         payWay:this.state.payArray[e.detail.value]
     })
 }
  transform(time){
    let date=new Date();
    let month=date.getMonth();
    let  year=date.getFullYear();
    let oneDay=date.getDate();
    let params;
    if(month==11){
      month=-1;
      year+=1;
    }
    let now=moment().format('YYYY-MM-DD')
    if(time=="today"){
         params={
            START_DATE:now,
            END_DATE:now
         }
    }else if(time=="threeDays"){
          if(oneDay>3){
            params={
              START_DATE:moment([year,month,oneDay-2]).format('YYYY-MM-DD'),
              END_DATE:now
            }
          }else{
            let mix=3-oneDay;
            params={
              START_DATE:moment([year,month,1]).subtract(mix,"d").format('YYYY-MM-DD'),
              END_DATE:now
            }

          }

    }else if(time=="thisMonth"){
          params={
             START_DATE:moment([year,month,1]).format('YYYY-MM-DD'),
             END_DATE:moment([year,month+1,1]).subtract(1,"d").format('YYYY-MM-DD')
          }
    }else if(time=="thisYear"){
       params={
          START_DATE:moment([year,0,1]).format('YYYY-MM-DD'),
          END_DATE:moment([year+1,0,1]).subtract(1,"d").format('YYYY-MM-DD')
       }
    }else if(time=="lastMonth"){
       params={
         START_DATE:moment([year,month-1,1]).format('YYYY-MM-DD'),
         END_DATE:moment([year,month,1]).subtract(1,"d").format('YYYY-MM-DD')
       }
    }
    return params;
  }
  edit(ky){
    let timeType=this.state.timeType;
    let payWay=this.state.payWay;
    let arr=[timeType,payWay,{Query:this.state.Query}];
    localStorage.setItem("key",JSON.stringify(arr));
    Taro.navigateTo({
      url: '/pages/index/index?ACC_KY='+ky
    })
  }
  cancel(ky){
     this.setState({
        moduleShow:true,
        ACC_KY:ky,
        title:"是否确定撤销?"
     })
  }
  back(){
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }
  scroll(){
      let scrollDom=document.getElementsByClassName("contents")[0];
      let total=this.state.total;
      let rows=this.state.pageSize
      let totalPage=Math.ceil(total / rows );
   /*    console.log("st:"+scrollDom.scrollTop);
      console.log("cl:"+scrollDom.clientHeight);
      console.log("sh:"+scrollDom.scrollHeight); */
      if(scrollDom.clientHeight+scrollDom.scrollTop>=scrollDom.scrollHeight){
           if(this.state.currentPage<totalPage){
                this.setState({
                     currentPage:this.state.currentPage+1
                },()=>{
                    this.search()
                })
           }else{
             if(this.state.currentPage==totalPage){
              Taro.atMessage({
                "message":"已经到底了",
                "type":"info"
               })
             } 

           }
      }

  }
  render () {
    return (
      <View className='manage'>
           <text className="title" onClick={this.back.bind(this)}>新增渠道入账 <i className="at-icon at-icon-chevron-right"></i></text>
           <view className="searchArea">
           <AtSearchBar  showActionButton={true} actionName="搜索"  value={this.state.Query} onChange={this.queryChange.bind(this,"Query")} onActionClick={this.beforesearch.bind(this)}></AtSearchBar>
            <view className="at-row">
               <View className='at-col at-col-5 select at-col__offset-1'>
               <Picker mode='selector' range={this.state.timeArray} onChange={this.typeChange} rangeKey="name">
                <View className='picker'>
                   {this.state.timeType.name}
                   <i className="at-icon at-icon-chevron-down"></i>
                 </View>
               </Picker>
               </View>
               <View className='at-col at-col-5 select at-col__offset-1'>
               <Picker mode='selector' range={this.state.payArray} onChange={this.payChange} rangeKey="name">
                <View className='picker'>
                   {this.state.payWay.name}
                   <i className="at-icon at-icon-chevron-down"></i>
                 </View>
               </Picker>
               </View>
            </view>
           </view>
             <Card listArray={this.state.listArray} onEdit={(ky)=>this.edit(ky)} onCancel={(ky)=>this.cancel(ky)} scroll={()=>this.scroll()}></Card>
          <AtMessage />
          <AtToast isOpened={this.state.loading} text="正在加载" icon="at-icon at-icon-loading-2" hasMask duration={0} status="loading"></AtToast>
          <AtModal isOpened={this.state.moduleShow} cancelText='取消' confirmText='确认'  onConfirm={ this.handleConfirm.bind(this) } title={this.state.title} onCancel={ this.handleCancel.bind(this) }></AtModal>
      </View>
    )
  }
}
