export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 处理 API 请求
    if (pathname.startsWith('/api/')) {
      return handleAPIRequest(request, env, ctx, pathname);
    }

    // 处理根路径
    if (pathname === '/') {
      return env.ASSETS.fetch(new Request(url.origin + '/index.html'));
    }

    // 处理静态资源
    return env.ASSETS.fetch(request);
  },
};

// 处理 API 请求
async function handleAPIRequest(request, env, ctx, pathname) {
  // 处理歌单请求
  if (pathname.startsWith('/api/playlist/')) {
    const playlistName = pathname.split('/').pop().replace('.json', '');
    const validPlaylists = ['hot', 'new', 'original', 'soaring', 'costomer', 'search'];
    
    if (validPlaylists.includes(playlistName)) {
      try {
        // 从静态资产中获取歌单文件
        const playlistUrl = `${request.url.split('/api/')[0]}/playlists/${playlistName}.json`;
        const response = await env.ASSETS.fetch(new Request(playlistUrl));
        
        // 返回 JSON 响应
        return new Response(response.body, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'public, max-age=300', // 5分钟缓存
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Playlist not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Invalid playlist' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }

  // 处理搜索请求
  if (pathname === '/api/search-songs') {
    if (request.method === 'POST') {
      try {
        // 获取搜索关键词
        const { keyword } = await request.json();
        
        if (!keyword) {
          return new Response(JSON.stringify({ error: 'Keyword is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          });
        }
        
        // 从 search.json 中获取数据 (在实际应用中，这里应该实现真正的搜索逻辑)
        const searchUrl = `${request.url.split('/api/')[0]}/playlists/search.json`;
        const response = await env.ASSETS.fetch(new Request(searchUrl));
        const searchData = await response.json();
        
        // 简单的关键词匹配 (实际应用中应该有更复杂的搜索逻辑)
        const filteredSongs = searchData.songs.filter(song => 
          song.title.toLowerCase().includes(keyword.toLowerCase()) ||
          song.artist.toLowerCase().includes(keyword.toLowerCase())
        );
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            songs: filteredSongs,
            totalSongs: filteredSongs.length
          }
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Search failed' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }

  // 处理刷新歌单请求
  if (pathname === '/api/refresh-playlists') {
    if (request.method === 'POST') {
      // 在静态部署中，我们无法真正刷新歌单
      // 这里返回一个模拟的成功响应
      return new Response(JSON.stringify({
        success: true,
        message: 'Playlists refresh triggered (not applicable in static deployment)'
      }), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }

  // 未找到的 API 端点
  return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}