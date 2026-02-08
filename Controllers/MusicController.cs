using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Models;
using MusicStoreApp.Services;

namespace MusicStoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly DataGenerator _generator;

        public MusicController()
        {
            // Simple instantiation for now to keep it "stupid simple"
            _generator = new DataGenerator();
        }

        [HttpGet]
        public IActionResult GetSongs(
            [FromQuery] string locale = "en",
            [FromQuery] long seed = 0,
            [FromQuery] int page = 1,
            [FromQuery] double likes = 0)
        {
            try
            {
                var songs = _generator.GenerateSongs(locale, seed, page, likes);
                return Ok(songs);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}