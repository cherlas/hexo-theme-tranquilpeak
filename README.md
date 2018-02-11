# Tranquilpeak

一个个性化的Tranquilpeak hexo主题，原主题 https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak

[![Tranquilpeak](http://d1u9biwaxjngwg.cloudfront.net/showcases/showcase-v1.10.jpg)](https://github.com/cherlas/hexo-theme-tranquilpeak)

[Demo](www.istarx.cc)

修改的地方：

1. 添加全屏首页；
2. 重新设计了目录显示，可以随滚动悬停；
3. 重新设计了搜索栏；
4. 添加了自定义内容：
   - 通过设置 post 的`coverHeight`值改变post head cover image 的高度；
   - 通过设置 post 的`blur`值改变header cover image 的模糊程度；
   - toc显示位置
       - true：宽度小于982px时，显示在博客内容的上面，大于982px时在博客内容右侧，可以悬停；
       - false：显示在博客内容的上面； 
5. 添加版权模版；
6. 添加加载动画；
7. 可以设置是否自动排列image的位置：`_config.yml`中的`auto_thumbnail_image_position`；
8. etc...

## 版本要求

Node: v4+
Hexo: 3.0.0+

## 开始 ##

### 安装

在hexo跟目录下执行以下命令:

``` bash
$ git clone https://github.com/cherlas/hexo-theme-tranquilpeak.git themes/tranquilpeak
```

修改 hexo根目录的配置文件 `_config.yml` 中的 `theme` 属性为 `tranquilpeak`.

### 更新

``` bash
cd themes/tranquilpeak
git pull
```

请阅读大神[Louis Barranqueiro](https://github.com/LouisBarranqueiro)的[文档](https://github.com/cherlas/hexo-theme-tranquilpeak/blob/master/docs/user.md), 写的很详细

## License ##

hexo-theme-tranquilpeak 采用 [GNU General Public License v3.0](https://github.com/cherlas/hexo-theme-tranquilpeak/blob/master/LICENSE)协议
