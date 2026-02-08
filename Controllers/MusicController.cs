using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Services;
using MusicStoreApp.Models;

namespace MusicStoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly DataGenerator _generator = new DataGenerator();

        [HttpGet]
        public IActionResult GetSongs(string locale = "en", long seed = 0, int page = 1, double likes = 0)
        {
            // The service uses these parameters to generate the next 10 items
            var songs = _generator.GenerateSongs(locale, seed, page, likes);
            return Ok(songs);
        }
    }
}