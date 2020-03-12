Page({
    data : {
        scrollTop : 0
    },
    //页面滚动执行方式
    onPageScroll(event){
      console.log(event.scrollTop,'lqwTest')
        this.setData({
            scrollTop : event.scrollTop
        })
    }
});