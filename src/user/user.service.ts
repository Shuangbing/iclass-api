import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './user.dto';
import { User } from './user.entity';
import bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }


  createUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = bcrypt.hashSync(password, 10);
    user.firstName = firstName;
    user.lastName = lastName;
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findAllWithProjects(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ["subjects"]
    });
  }

  findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByEMail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email: email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
