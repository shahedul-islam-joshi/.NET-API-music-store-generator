using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Services;

namespace MusicStoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This matches the JS call: /api/music
    public class MusicController : ControllerBase
    {
        private readonly DataGenerator _generator = new DataGenerator();

        [HttpGet]
        public IActionResult GetSongs(string locale = "en", long seed = 0, int page = 1, double likes = 0)
        {
            var songs = _generator.GenerateSongs(locale, seed, page, likes);
            return Ok(songs);
        }
    }
}