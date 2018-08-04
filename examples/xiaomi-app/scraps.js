/**
 * Created by Cooper on 2018/08/03.
 */

module.exports = {
  home: {
    build: ({}) => ({
      url: 'http://app.mi.com/',
      headers: {
        Host: 'app.mi.com',
        Connection: 'keep-alive',
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
      $('.category-list li').each((i, e) => {
        l.push({
          page: 0,
          category: $(e)
            .find('a')
            .text(),
          categoryId: $(e)
            .find('a')
            .attr('href')
            .replace('/category/', ''),
          url:
            'http://app.mi.com' +
            $(e)
              .find('a')
              .attr('href'),
        });
      });
      return l;
    },
  },

  getItems: {
    build: ({ page, categoryId }) => ({
      url: 'http://app.mi.com/categotyAllListApi',
      qs: {
        page,
        categoryId,
        pageSize: '30',
      },
      headers: {
        Host: 'app.mi.com',
        Connection: 'keep-alive',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        Referer: 'http://app.mi.com/category/' + categoryId,
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    }),
    parse: ({ body }) => body,
  },
};
