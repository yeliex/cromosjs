declare namespace WechatMiniprogram.Component {
    interface ComponentOptions {
        /**
         * weapp-runtime参数
         */
        runtime?: {
            /**
             * 组件名
             */
            name?: string;
            /**
             * 模板代码
             */
            template: string;
            /**
             * 样式代码
             */
            style?: string;
            /**
             * component.json组件配置
             */
            options?: PageOptions;
        };
    }

    interface PageOptions {
        navigationBarBackgroundColor?: string;
        navigationBarTextStyle?: 'black' | 'white';
        navigationBarTitleText?: string;
        navigationStyle?: 'default' | 'custom';
        backgroundColor?: string;
        backgroundTextStyle?: string;
        backgroundColorTop?: string;
        backgroundColorBottom?: string;
        enablePullDownRefresh?: boolean;
        onReachBottomDistance?: number;
        pageOrientation?: 'auto' | 'portrait' | 'landscape';
        disableScroll?: boolean;
        usingComponents?: {
            [key: string]: string;
        };
    }
}
