import axios from 'axios';
import React, { FC, useEffect, useRef, useState } from 'react';
import EnTodoItemList from './EnTodoItemlist';
import EnTodoTitle from './EnTodoTitle';
interface Props {
  courseid: number;
  coursename: string;
  setName: any;
}

const EnTodoTemplate: FC<Props> = (props: Props) => {
  var local = sessionStorage.getItem('memberid');
  try {
    var memberid = Number(local.split('')[1]);
  } catch {
    var memberid = 0;
  }
  const [namelist, setNamelist] = useState([] as any);
  const [placelist, setPlacelist] = useState([] as any);
  const [index, setIndex] = useState([] as any);
  const [todos, setTodos] = useState([] as any);

  useEffect(() => {
    axios
      .get(`/api/en/myplace/findall/${memberid}`)
      .then(async (response) => {
        for (var i = 0; i < response.data.data.length; i++) {
          setPlacelist(response.data.data);
          setNamelist((prev: any) => [...prev, response.data.data[i].name]);
        }
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    setTodos([]);
    setIndex([]);
    axios
      .get(`/api/en/myplacecourse/findall/${props.courseid}`)
      .then(async (response) => {
        for (var i = 0; i < response.data.data.length; i++) {
          setTodos((prev: any) => [...prev, response.data.data[i].myplaceDto]);
          setIndex((prev: any) => [...prev, response.data.data[i].myplaceDto.placeId]);
        }
      })
      .catch((error) => {});
  }, [props.courseid]);

  const onClick = (list: any) => {
    if (todos.length >= 10) {
      alert('코스는 10개를 넘을 수 없습니다!');
    } else {
      if (index.indexOf(list.placeId) === -1) {
        setTodos((prev: any) => [...prev, list]);
        setIndex((prev: any) => [...prev, list.placeId]);
      }
    }
  };

  const likedlist: any = namelist.map((v: string, index: number) => (
    <>
      <button id={v} key={index} onClick={() => onClick(placelist[index])}>
        {namelist[index]}
      </button>
    </>
  ));

  const onRemove = (id: number) => {
    setTodos(todos.filter((place: any) => place.id !== id));
    var idx = index.indexOf(id);
    index[idx] = 0;
  };

  return (
    <>
      <div className="likedlist" style={{ display: 'inline-block' }}>
        {likedlist}
      </div>
      <EnTodoTitle>코스를 수정해 보아요!</EnTodoTitle>
      <EnTodoItemList
        todos={todos}
        onRemove={onRemove}
        courseid={props.courseid}
        coursename={props.coursename}
        setName={props.setName}
      />
    </>
  );
};

export default EnTodoTemplate;
