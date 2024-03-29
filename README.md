# cromosjs
简单的小程序跨平台解决方案

## 为什么需要一个新轮子
传统解决方案中, 小程序相关的跨端解决方案主要有两种模式
- 将web代码运行在小程序上, 低成本的比如webview, 高级的比如kbone
- 将web代码编译成小程序原生, 比如taro
- 将小程序代码编译成跨端代码, 比如morjs

webview调用原生方法比较困难, 只能使用cover-view实现组件覆盖, 体验受限同时要做大量的适配工作, 比如页面间跳转

kbone实现了在小程序中运行web的适配器, 额外多了一层dom=>vdom=>wxml的映射, 复杂项目会有比较严重的体积和性能问题

taro之类的性能比较好, 但是编译出来的小程序体积巨大, 项目大了以后很难优化, 对小程序原生接口的适配也不够及时, 跨大版本升级非常痛苦

morjs是比较理想的解决方案, 但是跟阿里域内需求高度绑定, 额外实现了很多对普通用户不需要的能力, 增加了复杂性; 同时后续支持也让人担忧

以上几种方式比较适合现有大量的web页面的情况下来降低开发成本, 或者考虑的更多是跨平台

针对我们现有的业务场景, 更加在意小程序侧的性能以及用户体验, 大部分的页面都是从0开始, 小程序作为web子集, 到web端的适配也会更容易

### 原则
只做最小化的适配, 减少额外的封装, 尽量使用原生小程序平台能力, 以减少额外的复杂性和性能损耗, 减少因为额外封装带来的不可预知的问题

必须保留一定心智负担, 使用者必须足够了解对应的小程序平台并有能力做针对性性能/体验优化(好的跨平台一定不是write once, run everywhere, 针对平台能力提供差异化体验是合理的)

期望能用**1.1**的成本解决1+1+...n的问题

### 解决什么问题
1. 支持将微信小程序DSL在编译时转换到其他平台小程序
2. 提供很薄的运行时polyfill降低接口转化使用成本
3. 提供基于react的web运行时, 支持在web中调用组件/页面, 提供小程序接口的polyfill
4. 支持tailwind

### 适合什么场景

不适合太复杂的业务逻辑, 更多考虑落地页的需求场景;

新项目, 或者愿意接受从小程序开始开发的成本;

或者: 已有微信小程序, 想同时支持其他小程序平台;
或者: 已有微信小程序, 想低成本提供一些web页面;

愿意接受在不同平台上针对不支持的能力提供降级体验;

有一定的开发和解决问题的能力(提倡基于本项目二次开发/封装以适合特异性需求)

## License
基于[AGPL-3.0](/blob/main/LICENSE)分发

例外情况: 
  - 使用了本项目源码作为自有服务

你可以使用本项目开发/基于本项目提供自有服务, 但是如果在此基础上二次开发/包装后直接作为商业服务, 则需要开源/取得商业授权
