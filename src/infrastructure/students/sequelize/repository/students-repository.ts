import Students from '../../../../domain/students/entity/students';
import StudentsRepositoryInterface from '../../../../domain/students/repository/students-repository.interface';
import StudentsInterfaceMapper from '../mappers/interfaces/students.interface.mapper';
import StudentsPhoneNumbersModel from '../models/students-phone-numbers.model';
import StudentsModel from '../models/students.model';

export default class StudentsRepository implements StudentsRepositoryInterface {
  constructor(
    private _studentsMappers: StudentsInterfaceMapper,
    private _studentsModel: typeof StudentsModel
  ) {}

  public async create(entity: Students): Promise<void> {
    await this._studentsModel.create(this._studentsMappers.toModel(entity), {
      include: [{ model: StudentsPhoneNumbersModel }],
    });
  }

  public async update(entity: Students): Promise<void> {
    await this._studentsModel.update(this._studentsMappers.toModel(entity), {
      where: {
        id: entity.id,
      },
    });
  }

  public async findById(id: string): Promise<Students> {
    try {
      const students = await this._studentsModel.findOne({
        where: {
          id,
        },
        include: ['phone_numbers'],
        rejectOnEmpty: true,
      });

      return this._studentsMappers.toEntity(students);
    } catch (error) {
      throw new Error('Students not found');
    }
  }

  public async findAll(): Promise<Students[]> {
    const students = await this._studentsModel.findAll({
      include: ['phone_numbers'],
    });

    return students.map((student) => this._studentsMappers.toEntity(student));
  }

  public async delete(id: string): Promise<void> {
    await this._studentsModel.destroy({
      where: {
        id,
      },
      force: true,
    });
  }
}
