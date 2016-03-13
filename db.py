#coding=utf-8

import traceback

import sqlalchemy
from sqlalchemy import create_engine, Table


class DBInterfaceError(Exception):
    pass


class DBConn(object):
    """DB connection class.

    Args:
        db_name (str): Default=SEQ_SA_INFO
    """

    def __init__(self, db_name='SEQ_SA_INFO'):
        self._db_name = db_name
        self._engine = self._get_engine()
        self._connection = self._engine.connect()
        self._transaction = self._connection.begin()

    def __del__(self):
        self._transaction.commit()
        self._connection.close()

    def get_connect(self):
        return self._connection

    def _get_engine(self):
        engine = create_engine('mysql+pymysql://{user}:{pass_wd}@{host}/{db}?charset={charset}'.format(
            user='root',
            pass_wd='root',
            host='127.0.0.1',
            db='SEQ_SA_INFO',
            charset='utf8'),
            echo=False,
            pool_size=10,
            pool_recycle=3600)
        return engine

    def transaction(self):

        return self._transaction

    def execute(self, cmd, get_all=True):
        """
        Execute a sql and return result, fetch one if not get_all.
        :param cmd: str, raw sql string.
        :param get_all: boolean. True if want to fetch all else fetch one.
        :return: Fetch all if get_all else fetch one.
        """
        try:
            result = self._connection.execute(cmd)
            try:
                result = result.fetchall() if get_all else result.fetchone()
            except Exception, e:
                result = result.rowcount
            return result
        except Exception, ex:
            self._connection.close()
            raise DBInterfaceError(ex)

    def insert(self, table_name, data_dict):
        """
        Insert data_dict to table_name.
        :param table_name: str, table to insert into.
        :param data_dict: dict, {key: value} for insert.
        :return: primary keys of inserted elements if insert successfully.
        """
        try:
            table = Table(table_name, sqlalchemy.MetaData(), autoload=True, autoload_with=self._engine)
            stmt = table.insert().values(**data_dict)
            result = self._connection.execute(stmt)
            return result.inserted_primary_key[0]
        except Exception, ex:
            self._connection.close()
            raise DBInterfaceError(ex)

    def update(self, table_name, condition_dict, update_dict):
        """
        Update table_name by update_dict where condition_dict.
        :param table_name: str, table to update.
        :param condition_dict: dict, update condition.
        :param update_dict: dict, {key: value} for update.
        :return: Updated rows count.
        """
        try:
            table = Table(table_name, sqlalchemy.MetaData(), autoload=True, autoload_with=self._engine)
            stmt = table.update().values(**update_dict)
            for key, value in condition_dict.items():
                if key in table.c:
                    where_column = table.c[key]
                    stmt = stmt.where(where_column == value)
            result = self._connection.execute(stmt)
            return result.rowcount
        except Exception, ex:
            self._connection.close()
            raise DBInterfaceError(ex)

    def delete(self, table_name, condition_dict):
        """
        Delete from table_name where condition_dict.
        :param table_name: str, table to delete from.
        :param condition_dict: dict, delete condition.
        :return: Deleted rows count.
        """
        try:
            table = Table(table_name, sqlalchemy.MetaData(), autoload=True, autoload_with=self._engine)
            stmt = table.delete()
            for key, value in condition_dict.items():
                if key in table.c:
                    where_column = table.c[key]
                    stmt = stmt.where(where_column == value)
            result = self._connection.execute(stmt)
            return result.rowcount
        except Exception, ex:
            self._connection.close()
            raise DBInterfaceError(ex)

if __name__ == '__main__':
    db = DBConn()
    print db.execute('select * from rna_sample_sequencing_type')
    info = {
            'cust_organization': 'aaaa',
            'project_name': 'aaaaa',
            'cust_user': 'adfadf',
            'sp_delive_date': 'afdasdf',
            'cust_tel': 'asfdafda',
            'sp_sum': 'adsfsdfadf',
            'project_number': '1111111',
            'sale_name': 'adfadf',
            'email': 'adsfadsfa'}
    print '----', db.insert('sample_project_master', info)


    print db.execute('select * from sample_project_master')

