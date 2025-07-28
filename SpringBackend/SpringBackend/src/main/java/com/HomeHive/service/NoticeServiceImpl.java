package com.HomeHive.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.NoticeError;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.dao.NoticeDao;
import com.HomeHive.dao.UserDao;
import com.HomeHive.dto.CreateNoticeDTO;
import com.HomeHive.dto.NoticeResponseDTO;
import com.HomeHive.entities.Notice;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class NoticeServiceImpl implements NoticeService{

	private final NoticeDao noticeDao;
	private final UserDao userDao;
	private final ModelMapper modelMapper;


	@Override
	public List<Notice> getAllNotices() {
		return noticeDao.findAllNotices();
	}
	
	@Override
	public List<Notice> getActiveNotices() {
		return noticeDao.findByActiveNotices(LocalDateTime.now());
	}

	@Override
	public Notice getNoticeById(Long noticeId) {
		return noticeDao.findById(noticeId)
				.orElseThrow(()->new HomeHiveApiException(NoticeError.NOTICE_NOT_FOUND.getMsg()));
	}

	@Override
	public NoticeResponseDTO createNotice(CreateNoticeDTO dto) {
	    Notice notice = new Notice();
	    notice.setTitle(dto.getTitle());
	    notice.setContent(dto.getContent());
	    notice.setValidUntil(dto.getValidUntil());
	    notice.setCreatedAt(LocalDateTime.now());
	    notice.setIsActive(true);
	    notice.setCreatedBy("admin@homehive.com"); 

	    noticeDao.save(notice);
	    return modelMapper.map(notice, NoticeResponseDTO.class);
	}

	@Override
	public NoticeResponseDTO updateNotice(Long noticeId, CreateNoticeDTO dto) {
		Notice updateNotice = getNoticeById(noticeId);
		updateNotice.setTitle(dto.getTitle());
		updateNotice.setContent(dto.getContent());
		updateNotice.setValidUntil(dto.getValidUntil());
		updateNotice.setUpdatedAt(LocalDateTime.now());

	    noticeDao.save(updateNotice);
	    return modelMapper.map(updateNotice, NoticeResponseDTO.class);
	}

	@Override
	public void deleteNotice(Long noticeId) {
		Notice notice = getNoticeById(noticeId);
		notice.setIsActive(false);
		
		noticeDao.save(notice);
	}
}
