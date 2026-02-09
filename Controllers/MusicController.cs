using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Services;

namespace MusicStoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMusic(string locale = "en", long seed = 123, int page = 1, double likes = 0)
        {
            var generator = new DataGenerator();
            var songs = generator.GenerateSongs(locale, seed, page, likes);
            return Ok(songs);
        }
    }
}