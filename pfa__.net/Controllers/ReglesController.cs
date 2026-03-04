using Microsoft.AspNetCore.Mvc;
using pfa__.net.Repositories;
using pfa__.net.Mapper;
using pfa__.net.DTO;

namespace pfa__.net.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReglesController : ControllerBase
    {
        private readonly IRegleRepository _regleRepository;

        public ReglesController(IRegleRepository regleRepository)
        {
            _regleRepository = regleRepository;
        }

        // GET: api/regles
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var regles = await _regleRepository.GetAllWithEquipementAsync();
            return Ok(RegleMapper.ToDtoList(regles));
        }

        // GET: api/regles/equipement/3
        [HttpGet("equipement/{idEquipement}")]
        public async Task<IActionResult> GetByEquipement(int idEquipement)
        {
            var regles = await _regleRepository.GetByEquipementIdAsync(idEquipement);
            return Ok(RegleMapper.ToDtoList(regles));
        }

        // GET: api/regles/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var regle = await _regleRepository.GetByIdAsync(id);
            if (regle == null) return NotFound();
            return Ok(RegleMapper.ToDto(regle));
        }

        // POST: api/regles
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RegleCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var model = RegleMapper.ToModel(dto);
            var created = await _regleRepository.CreateAsync(model);
            var withEquipement = await _regleRepository.GetByIdAsync(created.IdRegle);
            return CreatedAtAction(nameof(GetById), new { id = created.IdRegle },
                RegleMapper.ToDto(withEquipement!));
        }

        // DELETE: api/regles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _regleRepository.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}