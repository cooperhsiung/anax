/**
 * Created by Cooper on 2018/8/4.
 */

module.exports = {
  home: {
    build: () => ({
      url: 'http://app.hicloud.com/soft/list',
      headers: {
        Host: 'app.hicloud.com',
        Connection: 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    }),
    parse: ({ $ }) => {
      let l = [];
      $('.head-right a').each((i, e) => {
        l.push({
          category: $(e).text(),
          cateUrl: 'http://app.hicloud.com' + $(e).attr('href'),
        });
      });
      return l;
    },
  },

  getItems: {
    build: ({ cateUrl, pageNum, category }) => ({
      url: `${cateUrl}_2_${pageNum}`,
      headers: {
        Host: 'app.hicloud.com',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Cookie: 'cs6k_langid=zh_cn',
      },
    }),
    parse: ({ $, category }) => {
      let l = [];
      $('.unit-main .list-game-app').each((i, e) => {
        l.push({
          origin: '华为市场',
          name: $(e)
            .find('.title')
            .text()
            .trim(),
          category,
          times: $(e)
            .find('.app-btn span')
            .eq(1)
            .text()
            .trim()
            .replace('下载:', ''),
          lastModified: new Date(),
        });
      });
      return l;
    },
  },
};
