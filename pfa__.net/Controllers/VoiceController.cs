using Microsoft.AspNetCore.Mvc;
using pfa__.net.Services;
using pfa__.net.Data; // ton DbContext
using pfa__.net.Models; // modèle Equipement

namespace pfa__.net.Controllers
{
    [ApiController]
    [Route("api/voice")]
    public class VoiceController : ControllerBase
    {
        private readonly SpeechService _speechService;
        private readonly AppDbContext _context;

        public VoiceController(SpeechService speechService, AppDbContext context)
        {
            _speechService = speechService;
            _context = context;
        }
        [HttpPost("command")]
        public async Task<IActionResult> VoiceCommand(IFormFile audio, [FromForm] int equipementId)
        {
            if (audio == null || audio.Length == 0)
                return BadRequest(new { message = "Aucun audio reçu" });

            var path = Path.Combine(Path.GetTempPath(), $"voice_{Guid.NewGuid()}.wav");
            using (var stream = new FileStream(path, FileMode.Create))
                await audio.CopyToAsync(stream);

            string text;
            try
            {
                text = _speechService.ConvertSpeechToText(path)?.Trim().ToUpper();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erreur reconnaissance vocale: {ex.Message}" });
            }
            finally
            {
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            var equip = await _context.Equipements.FindAsync(equipementId);
            if (equip == null)
                return NotFound(new { message = "Équipement introuvable" });
            string command = "UNKNOWN";

            if (text.Contains("ETEINDRE") || text.Contains("OFF"))
            {
                equip.Etat = "OFF";
                command = "OFF";
            }
            else if (text.Contains("ALLUME") || text.Contains("ON"))
            {
                equip.Etat = "ON";
                command = "ON";
            }

            await _context.SaveChangesAsync();

            return Ok(new { command = command, detectedText = text });
        }
    }
}