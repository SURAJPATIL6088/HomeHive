package com.HomeHive.service;

import java.util.List;

import com.HomeHive.dto.CreateNoticeDTO;
import com.HomeHive.dto.NoticeResponseDTO;
import com.HomeHive.entities.Notice;

public interface NoticeService{
	List<Notice>getAllNotices();
	
	List<Notice>getActiveNotices();
	
	Notice getNoticeById(Long noticeId);
	
	NoticeResponseDTO createNotice(CreateNoticeDTO notice);
	
	NoticeResponseDTO updateNotice(Long noticeId, CreateNoticeDTO notice);
	
	void deleteNotice(Long noticeId);
}
