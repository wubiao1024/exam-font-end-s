import PaperItem from '@/pages/Admin/PaperManage/PaperItem';
import styles from './index.module.less';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, message, Modal, Pagination, PaginationProps } from 'antd';
import PaperItemDetail from '@/pages/Admin/PaperManage/PaperItemDetail/PaperItemDetail';
import { ProFormSelect } from '@ant-design/pro-components';
import { useGetSubjects } from '@/pages/Admin/PaperManage/hooks/useGetSubjects';
import paperApi from '@/api/paperApi';
import { GetPapersResponse, Paper } from '@/api/paperApi/types';
import { useRequest } from '@@/exports';
import { localURL } from '../../../../config/global';
import PublishExam from '@/pages/Admin/PaperManage/PublishExam';
import examApi from '@/api/examApi';

export default () => {
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [listTotalCount, setListTotalCount] = useState<number>(0);
  const [publishIsOpen, setPublishIsOpen] = useState<boolean>(false);

  // 试卷详情弹窗
  const [paperId, setPaperId] = useState<number | undefined>();

  const {
    data: allPapersData,
    run: getALLPapers,
    refresh: refreshGetAllPapers,
  } = useRequest(paperApi.getPapers, {
    manual: true,
    onSuccess: (data: GetPapersResponse) => {
      if (!!data) {
        setListTotalCount(data.listTotalCount);
      }
    },
  });
  // 读取papers
  const papers: GetPapersResponse['papers'] = useMemo(() => {
    return allPapersData?.papers || [];
  }, [allPapersData]);

  // 初始发起一次请求
  useEffect(() => {
    getALLPapers({ subjectId, pageNo, pageSize });
  }, []);
  useEffect(() => {
    getALLPapers({ subjectId, pageNo, pageSize });
  }, [pageNo, pageSize]);

  // 保存更改或者是新增的试卷
  const onSubmit = useCallback(
    async (data: Paper) => {
      console.log(data, 'paper');
      if (paperId) {
        const { success } = await paperApi.updatePaper(data);
        if (success) {
          message.success('更新试卷成功');
          // 刷新试卷列表
          refreshGetAllPapers?.();
          setIsOpen(false);
        }
      } else {
        // 新增试卷
        const { success } = await paperApi.addPaper(data);
        if (success) {
          message.success('新增试卷成功');
          // 刷新试卷列表
          refreshGetAllPapers?.();
          //关闭弹窗
          setIsOpen(false);
        }
      }
    },
    [paperId],
  );
  const onCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onChange: PaginationProps['onChange'] = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <span className={styles.label}>所属学科：</span>
        <ProFormSelect
          className={styles.select}
          name={'subjectId'}
          onChange={(subjectId: number) => {
            console.log(subjectId);
            setSubjectId(subjectId);
          }}
          placeholder="请选择所属学科"
          request={useGetSubjects?.()}
          debounceTime={300}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className={styles.button}
          onClick={() => {
            getALLPapers({ subjectId, pageNo, pageSize });
          }}
        >
          搜索
        </Button>
        <Button
          type="primary"
          className={styles.add}
          onClick={() => {
            setPaperId(undefined);
            setIsOpen(true);
          }}
          icon={<PlusOutlined />}
        >
          添加试卷
        </Button>
      </div>
      <div className={styles.display}>
        {papers.map(({ paper: item }) => (
          <PaperItem
            onPublishClick={() => {
              // TODO : 获取当前试卷id
              setPaperId(item.id);
              setPublishIsOpen(true);
            }}
            onPreviewClick={() => {
              window.open(`${localURL}/Paper/Preview/${item.id}`);
            }}
            onDeleteClick={async () => {
              Modal.confirm({
                title: '确认删除该试卷？',
                content: '删除后将无法恢复，请谨慎操作！',
                onOk: async () => {
                  const { success } = await paperApi.deletePaper({ id: item.id as number });
                  if (success) {
                    message.success('删除试卷成功');
                    refreshGetAllPapers();
                  }
                },
              });
            }}
            onDetailClick={() => {
              setPaperId(item.id);
              setIsOpen(true);
            }}
            className={styles.item}
            {...item}
            key={item.id}
          />
        ))}
      </div>
      <div className={styles.pageNation}>
        <Pagination
          style={{ margin: '0 auto' }}
          onChange={onChange}
          total={listTotalCount}
          current={pageNo}
          pageSize={pageSize}
          pageSizeOptions={[6, 9, 12]}
          showQuickJumper
          showSizeChanger
          showTotal={(total) => `共 ${total} 条`}
        ></Pagination>
      </div>
      {/* 试卷详情弹窗 */}
      <PaperItemDetail isOpen={isOpen} id={paperId} onSubmit={onSubmit} onCancel={onCancel} />
      {/* 考试发布弹窗 */}
      <PublishExam
        onSubmit={async (data) => {
          // TODO 发布考试
          const { success } = await examApi.publishExam({ ...data, paperId: paperId as number });
          if (success) {
            message.success('考试发布成功');
          }
          refreshGetAllPapers?.();
          setPaperId(undefined);
          setPublishIsOpen(false);
        }}
        isOpen={publishIsOpen}
        onCancel={() => {
          // 试卷id置空
          setPaperId(undefined);
          setPublishIsOpen(false);
        }}
      />
    </div>
  );
};
