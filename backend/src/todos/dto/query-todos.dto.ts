import { IsIn, IsOptional } from 'class-validator';

import { taskLanes, todoFilters, type TaskLane, type TodoFilter } from '../todo.types';

export class QueryTodosDto {
  @IsOptional()
  @IsIn(todoFilters)
  filter?: TodoFilter = 'all';

  @IsOptional()
  @IsIn(taskLanes)
  lane?: TaskLane;
}
