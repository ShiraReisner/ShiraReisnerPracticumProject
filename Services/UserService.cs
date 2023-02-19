using AutoMapper;
using Common.DTO;
using Data;
using Microsoft.EntityFrameworkCore;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly HMOContext _db;
        public UserService(HMOContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task<UserDto> AddUserAsync(UserDto userDto)
        {
            try
            {
                var user = _mapper.Map<User>(userDto);
                await _db.Users.AddAsync(user);
                await _db.SaveChangesAsync();
                return _mapper.Map<UserDto>(await _db.Users.FindAsync(user.Id));
            }
            catch (Exception ex)
            {
                return null; // An error occured
            }
        }

        public async Task<List<UserDto>> GetUsersAsync()
        {
            try
            {
                return _mapper.Map<List<UserDto>>(await _db.Users.ToListAsync());
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
