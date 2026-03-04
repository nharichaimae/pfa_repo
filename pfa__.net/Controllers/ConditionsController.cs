using Microsoft.AspNetCore.Mvc;
using pfa__.net.Repositories;
using pfa__.net.Mapper;
using pfa__.net.DTO;

namespace pfa__.net.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConditionsController : ControllerBase
    {
        private readonly IConditionRepository _conditionRepository;

        public ConditionsController(IConditionRepository conditionRepository)
        {
            _conditionRepository = conditionRepository;
        }

        // GET: api/conditions
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var conditions = await _conditionRepository.GetAllAsync();
            return Ok(ConditionMapper.ToDtoList(conditions));
        }

        // GET: api/conditions/equipement/3
        [HttpGet("equipement/{idEquipement}")]
        public async Task<IActionResult> GetByEquipement(int idEquipement)
        {
            var conditions = await _conditionRepository.GetByEquipementIdAsync(idEquipement);
            return Ok(ConditionMapper.ToDtoList(conditions));
        }

        // GET: api/conditions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var condition = await _conditionRepository.GetByIdAsync(id);
            if (condition == null) return NotFound();
            return Ok(ConditionMapper.ToDto(condition));
        }

        // POST: api/conditions
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ConditionCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var model = ConditionMapper.ToModel(dto);
            var created = await _conditionRepository.CreateAsync(model);
            var withEquipement = await _conditionRepository.GetByIdAsync(created.Id);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ConditionMapper.ToDto(withEquipement!));
        }

        // DELETE: api/conditions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _conditionRepository.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}